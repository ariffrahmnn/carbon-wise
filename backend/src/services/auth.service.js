import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';

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

  async login(email, password) {
    try {
      // 1. Cek keberadaan user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('Email atau password salah!');
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
}

export default new AuthService();