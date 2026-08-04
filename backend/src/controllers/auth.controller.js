import authService from '../services/auth.service.js';

class AuthController {
  async register(req, res) {
    try {
      const { fullName, email, password, schoolName, classGrade } = req.body;

      // Validasi input sederhana
      if (!fullName || !email || !password || !schoolName || !classGrade) {
        return res.status(400).json({
          success: false,
          message: 'Semua field wajib diisi!',
        });
      }

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
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan internal server.',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password wajib diisi!',
        });
      }

      const result = await authService.login(email, password);

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
}

export default new AuthController();