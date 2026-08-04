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
}

export default new AuthController();