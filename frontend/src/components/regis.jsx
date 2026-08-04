import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css'; // Memakai stylesheet yang sama agar desain konsisten

// URL gambar latar sisi kanan
const fotoHutan = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    namaSekolah: '',
    kelas: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Menggunakan Axios & penyesuaian endpoint API backend Carbon Wise
      const response = await axios.post('http://localhost:3000/api/v1/auth/register', {
        namaLengkap: formData.namaLengkap,
        email: formData.email,
        password: formData.password,
        namaSekolah: formData.namaSekolah,
        kelas: formData.kelas
      });

      if (response.status === 201 || response.status === 200) {
        alert('Registrasi Berhasil! Silakan Login.');
        navigate('/login'); // Redirect langsung ke halaman login
      }
    } catch (err) {
      // Menangkap response error dari backend jika ada
      const message = err.response?.data?.message || 'Gagal mendaftar, periksa data Anda.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-card-container">
        
        {/* SISI KIRI: FORM REGISTER */}
        <div className="login-form-section">
          <h1 className="login-title">Create Account</h1>

          {errorMsg && <div className="login-error-box">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {/* INPUT NAMA LENGKAP */}
            <div className="login-input-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="namaLengkap"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.namaLengkap}
                onChange={handleChange}
              />
            </div>

            {/* INPUT EMAIL */}
            <div className="login-input-group">
              <label>Email / Gmail</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Contoh: budi@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* INPUT KATA SANDI */}
            <div className="login-input-group">
              <label>Kata Sandi</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* INPUT NAMA SEKOLAH */}
            <div className="login-input-group">
              <label>Nama Sekolah</label>
              <input
                type="text"
                name="namaSekolah"
                required
                placeholder="Contoh: SMAN 1 Pekanbaru"
                value={formData.namaSekolah}
                onChange={handleChange}
              />
            </div>

            {/* INPUT KELAS */}
            <div className="login-input-group">
              <label>Kelas</label>
              <input
                type="text"
                name="kelas"
                required
                placeholder="Contoh: 12.1"
                value={formData.kelas}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn" style={{ marginTop: '15px' }}>
              {loading ? 'PROCESSING...' : 'SIGN UP'}
            </button>
          </form>
        </div>

        {/* SISI KANAN: GAMBAR / HERO */}
        <div 
          className="login-image-section" 
          style={{ backgroundImage: `url(${fotoHutan})` }}
        >
          <div className="login-image-overlay">
            <h2 className="login-overlay-title">Welcome Back!</h2>
            <p className="login-overlay-text">
              To keep connected with us please login with your personal info
            </p>
            <button 
              type="button" 
              className="login-signup-outline-btn"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}