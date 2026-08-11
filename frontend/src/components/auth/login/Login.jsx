import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';
import SuccessModalCard from '../shared/SuccessModalCard.jsx';
import ForgotPasswordModal from './ForgotPasswordModal.jsx';
import { isTokenExpired, clearSession } from '../../../utils/auth.js';
import '../../../styles/auth/shared/auth-form.css';

import fotoHutan from '../../../assets/LoginRegisterCard.jpg';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
    // Tangkap token & user dari callback URL Google OAuth
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('token');
    const oauthUser = params.get('user');
    const oauthError = params.get('error');

    if (oauthError) {
      setErrorMsg(decodeURIComponent(oauthError));
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (oauthToken && oauthUser) {
      try {
        localStorage.setItem('token', oauthToken);
        localStorage.setItem('user', oauthUser);
        window.history.replaceState({}, document.title, window.location.pathname);
        setShowSuccessModal(true);
        return;
      } catch (e) {
        console.error('Failed to parse Google OAuth user:', e);
      }
    }

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && isTokenExpired(token)) {
      clearSession();
      setErrorMsg('Sesi Anda telah kedaluwarsa (lebih dari 24 jam). Silakan login kembali.');
    } else if (token) {
      let user = null;
      try { user = JSON.parse(savedUser); } catch(e) {}
      if (user?.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/input');
      }
      return;
    }

    // Animasi Entrance GSAP untuk tombol navigasi
    gsap.fromTo(
      ".auth-back-home-btn",
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
    );
    gsap.fromTo(
      ".login-signup-outline-btn",
      { opacity: 0, scale: 0.9, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, delay: 0.2, ease: "back.out(1.5)" }
    );
  }, [navigate]);

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
      const response = await fetch(buildApiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.namaLengkap,
          password: formData.password
        })
      });

      const data = await response.json();
      const payload = data.data || data;

      if (response.ok) {
        const { token, user } = payload;
        if (token) localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));

        setShowSuccessModal(true);
      } else {
        throw new Error(data.message || 'Login gagal, periksa nama dan password Anda.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    const savedUser = localStorage.getItem('user');
    let user = null;
    try { user = JSON.parse(savedUser); } catch(e) {}

    if (user?.role?.toUpperCase() === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/input');
    }
  };

  // Handle Login Google Placeholder
  const handleGoogleLogin = () => {
    window.location.href = buildApiUrl('/api/v1/auth/google');
  };

  return (
    <div className="login-main-container">
      {/* SUCCESS MODAL CARD */}
      <SuccessModalCard
        isOpen={showSuccessModal}
        title="Login Berhasil!"
        message="Selamat datang kembali di CarbonWise! Akses akun Anda telah aktif."
        buttonText="Masuk ke Dashboard"
        onConfirm={handleModalConfirm}
      />

      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />

      <div className="login-card-container">
        
        {/* SISI KIRI: FORM LOGIN */}
        <div className="login-form-section">
          <button
            type="button"
            className="auth-back-home-btn"
            onClick={() => navigate('/')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Beranda
          </button>
          <h1 className="login-title">Log in</h1>

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
            Log in with Google
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
                autoComplete="one-time-code"
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
                autoComplete="one-time-code"
              />
            </div>

            {/* LINK LUPA KATA SANDI */}
            <div style={{ textAlign: 'right', marginTop: '6px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4e0000',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Lupa Kata Sandi?
              </button>
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                'LOG IN'
              )}
            </button>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>

            <div className="auth-mobile-link">
              <button 
                type="button" 
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4e0000',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Belum punya akun? Daftar Sekarang
              </button>
            </div>
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
              Belum punya akun? Daftar Sekarang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}