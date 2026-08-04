import React, { useState } from 'react';
import '../styles/login.css';

// URL gambar sementara
const fotoHutan = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop";

export default function Login() {
  // State form hanya untuk Nama dan Password
  const [formData, setFormData] = useState({
    nama: '',
    password: ''
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
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal masuk, periksa data Anda.');

      alert('Login Berhasil!');
      if (data.token) localStorage.setItem('token', data.token);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="login-main-container">
      <div className="login-card-container">
        
        {/* SISI KIRI: FORM INPUT */}
        <div className="login-form-section">
          <h1 className="login-title">Log in</h1>

          {/* OPSI LOGIN GOOGLE (TETAP ADA) */}
          <div className="login-social-buttons">
            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="login-google-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Log in  with Google
            </button>
          </div>

          <div className="login-divider">
            <span className="login-divider-line"></span>
            <span className="login-divider-text">or use your name & password</span>
            <span className="login-divider-line"></span>
          </div>

          {errorMsg && <div className="login-error-box">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {/* INPUT NAMA LENGKAP */}
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

            <div className="login-forgot-container">
              <a href="#forgot-password" className="login-forgot-link">
                Forgot Your Password?
              </a>
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? 'PROCESSING...' : 'Log in '}
            </button>
          </form>
        </div>

        {/* SISI KANAN: GAMBAR HUTAN */}
        <div 
          className="login-image-section" 
          style={{ backgroundImage: `url(${fotoHutan})` }}
        >
          <div className="login-image-overlay">
            <h2 className="login-overlay-title">Hello, Friend!</h2>
            <p className="login-overlay-text">
              Register with your personal details to use all of site features
            </p>
            <button className="login-signup-outline-btn">Log in</button>
          </div>
        </div>

      </div>
    </div>
  );
}