import authService from '../services/auth.service.js';

class AuthController {
  async register(req, res) {
  try {
    const { fullName, email, password, schoolName, classGrade } = req.body;

    // 1. Validasi field wajib
    if (!fullName || !email || !password || !schoolName || !classGrade) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi!',
      });
    }

    // 2. Validasi sederhana format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid!',
      });
    }

    // 3. Panggil Service
    const newUser = await authService.register({
      fullName,
      email,
      password,
      schoolName,
      classGrade,
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: newUser,
    });
  } catch (error) {
    // 4. Handling Error Duplikat dari Database Level (PostgreSQL: 23505, MySQL: ER_DUP_ENTRY)
    if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar, silakan gunakan email lain.',
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan internal server.',
    });
  }
}

  async login(req, res) {
    try {
      const { email, fullName, password } = req.body;

      if ((!email && !fullName) || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email/Nama dan password wajib diisi!',
        });
      }

      const identifier = email || fullName;
      const result = await authService.login(identifier, password);

      return res.status(200).json({
        success: true,
        message: 'Login berhasil!',
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan internal server.',
      });
    }
  }

  async forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.status(200).json({ success: true, message: result.message });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
  };

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Gagal memperbarui kata sandi.',
      });
    }
  }

  googleRedirect(req, res) {
    return authService.googleAuthRedirect(res);
  }

  async googleCallback(req, res) {
    const { code } = req.query;
    return await authService.handleGoogleCallback(code, res);
  }
}

export default new AuthController();