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

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        const error = new Error('Email atau password salah!');
        error.statusCode = 401;
        throw error;
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      });

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
}

export default new AuthService();