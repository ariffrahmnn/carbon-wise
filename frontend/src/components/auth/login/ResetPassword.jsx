import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';
import SuccessModalCard from '../shared/SuccessModalCard.jsx';
import '../../../styles/auth/shared/auth-form.css';

import fotoHutan from '../../../assets/LoginRegisterCard.jpg';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6 }
      );
    }

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.3'
      );
    }

    if (formRef.current) {
      tl.fromTo(
        formRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        '-=0.2'
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setLoading(true);

    try {
      // Panggilan API backend placeholder (bebas disesuaikan oleh teman Anda)
      await fetch(buildApiUrl('/api/v1/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      }).catch(() => {});

      setShowSuccessModal(true);
    } catch (err) {
      setErrorMsg('Gagal memperbarui kata sandi. Silakan coba lagi.');
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
        title="Kata Sandi Diperbarui!"
        message="Kata sandi baru Anda telah berhasil disimpan. Silakan login dengan kata sandi baru Anda."
        buttonText="Lanjutkan ke Login"
        onConfirm={handleModalConfirm}
      />

      <div className="login-card-container" ref={cardRef}>
        {/* SISI KIRI: FORM RESET PASSWORD */}
        <div className="login-form-section">
          <h1 className="login-title" ref={titleRef}>Set New Password</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Buat kata sandi baru yang kuat untuk keamanan akun CarbonWise Anda.
          </p>

          {errorMsg && <div className="login-error-box">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="login-form" ref={formRef}>
            {/* INPUT KATA SANDI BARU */}
            <div className="login-input-group">
              <label>Kata Sandi Baru</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* INPUT KONFIRMASI KATA SANDI BARU */}
            <div className="login-input-group">
              <label>Konfirmasi Kata Sandi Baru</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                'SIMPAN KATA SANDI BARU'
              )}
            </button>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </form>
        </div>

        {/* SISI KANAN: GAMBAR / HERO */}
        <div
          className="login-image-section"
          style={{ backgroundImage: `url(${fotoHutan})` }}
        >
          <div className="login-image-overlay">
            <h2 className="login-overlay-title">Secure Your Account</h2>
            <p className="login-overlay-text">
              Ensure your new password is at least 6 characters long and easy to remember.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
