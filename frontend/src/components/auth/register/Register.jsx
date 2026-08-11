import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';
import SuccessModalCard from '../shared/SuccessModalCard.jsx';
import '../../../styles/auth/shared/auth-form.css'; // Memakai stylesheet yang sama agar desain konsisten

// URL gambar latar sisi kanan
import fotoHutan from '../../../assets/LoginRegisterCard.jpg';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
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
  }, []);

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
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.namaLengkap,
          email: formData.email,
          password: formData.password,
          schoolName: formData.namaSekolah,
          classGrade: formData.kelas
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        throw new Error(data.message || 'Gagal mendaftar, periksa data Anda.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="login-main-container">
      {/* SUCCESS MODAL CARD */}
      <SuccessModalCard
        isOpen={showSuccessModal}
        title="Registrasi Berhasil!"
        message="Selamat datang di CarbonWise! Akun Anda telah berhasil dibuat. Silakan login."
        buttonText="Lanjutkan ke Login"
        onConfirm={handleModalConfirm}
      />

      <div className="login-card-container">
        
        {/* SISI KIRI: FORM REGISTER */}
        <div className="login-form-section">
          <button
            type="button"
            className="auth-back-home-btn"
            onClick={() => navigate('/')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Beranda
          </button>
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
                autoComplete="one-time-code"
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
                 autoComplete="one-time-code"
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
                 autoComplete="one-time-code"
              />
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn" style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                'SIGN UP'
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
                onClick={() => navigate('/login')}
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
                Sudah punya akun? Log in
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
            <h2 className="login-overlay-title">Welcome Back!</h2>
            <p className="login-overlay-text">
              To keep connected with us please login with your personal info
            </p>
            <button 
              type="button" 
              className="login-signup-outline-btn"
              onClick={() => navigate('/login')}
            >
              Sudah punya akun? Log in
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}