import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import transporter from '../configs/mailer.js';

class AuthService {
  async register(data) {
    try {
      // 1. Cek apakah email sudah terdaftar
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        const error = new Error('Email sudah terdaftar!');
        error.statusCode = 400;
        throw error;
      }

      // 2. Hash Password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      // 3. Simpan ke database
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
      // 1. Cek keberadaan user (identifier bisa berupa email atau full name)
      let user;
      if (typeof identifier === 'string' && identifier.includes('@')) {
        user = await userRepository.findByEmail(identifier);
      } else {
        user = await userRepository.findByFullName(identifier);
      }
      if (!user) {
        const error = new Error('Email/Nama atau password salah!');
        error.statusCode = 401;
        throw error;
      }

      // 2. Verifikasi Password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        const error = new Error('Email atau password salah!');
        error.statusCode = 401;
        throw error;
      }

      // 3. Generate Token JWT
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      });

      // 4. Return data user & token
      return {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          schoolName: user.school_name,
          classGrade: user.class_grade,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
  
  async forgotPassword(email) {
    // 1. Cek keberadaan user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email tidak ditemukan!');
    }

    // 2. Buat Reset Token (kadaluwarsa dalam 15 menit)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '15m' }
    );

    // 3. Susun URL Reset Password untuk Frontend
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    // 4. Susun Opsi Email HTML
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

    // 5. Kirim Email via Nodemailer
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      const error = new Error('Gagal mengirim email reset.');
      error.statusCode = 500;
      throw error;
    }

    return { message: 'Link reset password telah dikirim ke email Anda!' };
  }
}

export default new AuthService();