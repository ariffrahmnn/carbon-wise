import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import transporter from '../configs/mailer.js';

class AuthService {
  async register(data) {
    try {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        const error = new Error('Email sudah terdaftar!');
        error.statusCode = 400;
        throw error;
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      const newUser = await userRepository.createUser({
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        schoolName: data.schoolName,
        classGrade: data.classGrade,
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async login(identifier, password) {
    try {
      const cleanIdentifier = typeof identifier === 'string' ? identifier.trim() : '';
      const cleanPassword = typeof password === 'string' ? password.trim() : '';

      const users = await userRepository.findAllByIdentifier(cleanIdentifier);
      if (!users || users.length === 0) {
        const error = new Error('Email/Nama atau password salah!');
        error.statusCode = 401;
        throw error;
      }

      let validUser = null;
      for (const u of users) {
        let isPasswordValid = false;
        if (u.password_hash && (u.password_hash.startsWith('$2a$') || u.password_hash.startsWith('$2b$') || u.password_hash.startsWith('$2y$'))) {
          isPasswordValid = await bcrypt.compare(cleanPassword, u.password_hash);
        } else {
          // Fallback legacy support with bcrypt comparison fallback
          isPasswordValid = (cleanPassword === (u.password_hash || '').trim());
        }

        if (isPasswordValid) {
          validUser = u;
          break;
        }
      }

      if (!validUser) {
        const error = new Error('Email/Nama atau password salah!');
        error.statusCode = 401;
        throw error;
      }

      const payload = {
        id: validUser.id,
        email: validUser.email,
        role: validUser.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      });

      return {
        user: {
          id: validUser.id,
          fullName: validUser.full_name,
          email: validUser.email,
          role: validUser.role,
          schoolName: validUser.school_name,
          classGrade: validUser.class_grade,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
  
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email tidak ditemukan!');
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '15m' }
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Carbon Wise Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔒 Reset Kata Sandi - Carbon Wise',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Halo, ${user.full_name}!</h2>
          <p>Kami menerima permintaan untuk mereset kata sandi akun Carbon Wise Anda.</p>
          <p>Klik tombol di bawah ini untuk membuat kata sandi baru (Link berlaku selama 15 menit):</p>
          <a href="${resetUrl}" style="background-color: #4A154B; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">
            Reset Kata Sandi
          </a>
          <p>Jika Anda tidak meminta ini, abaikan saja email ini.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      const error = new Error('Gagal mengirim email reset.');
      error.statusCode = 500;
      throw error;
    }

    return { message: 'Link reset password telah dikirim ke email Anda!' };
  }

  googleAuthRedirect(res) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback';

    if (!clientId || clientId === 'your_google_client_id_here') {
      return res.status(400).send(`
        <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #d32f2f;">Google Client ID belum diisi!</h2>
          <p>Silakan buka file <code>backend/.env</code> dan isi <code>GOOGLE_CLIENT_ID</code> serta <code>GOOGLE_CLIENT_SECRET</code> dari Google Cloud Console.</p>
          <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4a0e17; color: white; text-decoration: none; border-radius: 6px;">Kembali ke Halaman Login</a>
        </div>
      `);
    }

    const scope = encodeURIComponent('openid profile email');
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&prompt=select_account`;

    return res.redirect(googleAuthUrl);
  }

  async handleGoogleCallback(code, res) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Kode otorisasi Google tidak ditemukan!')}`);
    }

    try {
      // 1. Tukar authorization code dengan OAuth tokens dari Google API
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || 'Gagal menukar kode otorisasi dengan Google token.');
      }

      // 2. Dapatkan informasi profil user dari Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });

      const googleUser = await userInfoResponse.json();

      if (!googleUser || !googleUser.email) {
        throw new Error('Gagal mengambil informasi profil dari Google.');
      }

      // 3. Cari atau buat user baru di database PostgreSQL
      let user = await userRepository.findByEmail(googleUser.email);
      if (!user) {
        const randomPasswordHash = await bcrypt.hash(`google_oauth_${googleUser.id}_${Date.now()}`, 10);
        user = await userRepository.createUser({
          fullName: googleUser.name || googleUser.email.split('@')[0],
          email: googleUser.email,
          passwordHash: randomPasswordHash,
          schoolName: '-',
          classGrade: '-',
          role: 'USER'
        });
      }

      // 4. Generate JWT Token CarbonWise
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      });

      const userData = {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        schoolName: user.school_name,
        classGrade: user.class_grade,
      };

      // 5. Redirect ke Frontend dengan query string token & user
      const targetUrl = `${frontendUrl}/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      return res.redirect(targetUrl);
    } catch (err) {
      console.error('Error handling Google OAuth callback:', err);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message || 'Login Google gagal!')}`);
    }
  }
}

export default new AuthService();