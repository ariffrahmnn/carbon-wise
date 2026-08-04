import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const fotoHutan = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
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

  // Handle Login Manual (Nama Lengkap + Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          namaLengkap: formData.namaLengkap,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        alert('Login Berhasil!');
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login gagal, periksa nama dan password Anda.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Google Placeholder
  const handleGoogleLogin = () => {
    // Nanti dihubungkan dengan OAuth Google (misal redirect ke backend endpoint atau pakai library @react-oauth/google)
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div className="login-main-container">
      <div className="login-card-container">
        
        {/* SISI KIRI: FORM LOGIN */}
        <div className="login-form-section">
          <h1 className="login-title">Sign In</h1>

          {errorMsg && <div className="login-error-box">{errorMsg}</div>}

          {/* TOMBOL GOOGLE LOGIN */}
          <button 
            type="button" 
            className="google-login-btn"
            onClick={handleGoogleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google Logo" 
              style={{ width: '18px', height: '18px' }}
            />
            Sign in with Google
          </button>

          <div style={{ textAlign: 'center', margin: '10px 0', color: '#888' }}>
            <span>OR</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* INPUT NAMA LENGKAP */}
            <div className="login-input-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="namaLengkap"
                required
                placeholder="Masukkan Nama Lengkap"
                value={formData.namaLengkap}
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

            <button type="submit" disabled={loading} className="login-submit-btn" style={{ marginTop: '15px' }}>
              {loading ? 'LOGGING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* SISI KANAN: GAMBAR / HERO */}
        <div 
          className="login-image-section" 
          style={{ backgroundImage: `url(${fotoHutan})` }}
        >
          <div className="login-image-overlay">
            <h2 className="login-overlay-title">Hello, Friend!</h2>
            <p className="login-overlay-text">
              Enter your personal details and start journey with us
            </p>
            <button 
              type="button" 
              className="login-signup-outline-btn"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}