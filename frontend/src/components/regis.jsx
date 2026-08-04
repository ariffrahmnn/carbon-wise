import React, { useState } from 'react';
import '../styles/login.css'; // Memakai stylesheet yang sama agar desain konsisten

// URL gambar latar sisi kanan
const fotoHutan = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop";

export default function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    sekolah: '',
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
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mendaftar, periksa data Anda.');

      alert('Registrasi Berhasil! Silakan Login.');
      // Navigasi/redirect bisa ditambahkan di sini jika menggunakan react-router

    } catch (err) {
      setErrorMsg(err.message);
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
            {/* INPUT NAMA */}
            <div className="login-input-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            {/* INPUT EMAIL / GMAIL */}
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
                name="sekolah"
                required
                placeholder="Contoh: SMAN 1 Pekanbaru"
                value={formData.sekolah}
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
            <button className="login-signup-outline-btn">Log in</button>
          </div>
        </div>

      </div>
    </div>
  );
}