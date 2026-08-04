import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/forgotPasswordModal.css';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsSent(false);
      setEmail('');
      setErrorMsg('');

      // Fade in background overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Card scale-bounce animation
      gsap.fromTo(
        cardRef.current,
        { scale: 0.75, opacity: 0, y: 35 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );

      // Icon spin animation
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotate: -45 },
        { scale: 1, rotate: 0, duration: 0.6, delay: 0.15, ease: 'elastic.out(1.2, 0.4)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Masukkan email Gmail terdaftar Anda!');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      // Panggilan API backend
      const response = await fetch('http://localhost:3000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMsg(data.message || 'Gagal mengirim link reset. Periksa kembali email Anda.');
        return;
      }

      setIsSent(true);

      // Animasi kartu sukses
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotate: 60 },
        { scale: 1, rotate: 0, duration: 0.65, ease: 'elastic.out(1.2, 0.4)' }
      );
    } catch (err) {
      setErrorMsg('Gagal mengirim link reset. Periksa kembali email Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-modal-overlay" ref={overlayRef}>
      <div className="forgot-modal-card" ref={cardRef}>
        <button type="button" className="forgot-modal-close-btn" onClick={onClose} aria-label="Tutup">
          <span className="material-symbols-outlined">close</span>
        </button>

        {!isSent ? (
          <>
            <div className="forgot-modal-icon-wrap" ref={iconRef}>
              <span className="material-symbols-outlined">mail</span>
            </div>
            <h2 className="forgot-modal-title">Lupa Kata Sandi?</h2>
            <p className="forgot-modal-subtitle">
              Masukkan alamat email Gmail terdaftar Anda. Kami akan mengirimkan link reset kata sandi ke inbox Anda.
            </p>

            {errorMsg && <div className="forgot-modal-error">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="forgot-modal-form">
              <div className="forgot-modal-input-group">
                <label>Email / Gmail Terdaftar</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="forgot-modal-submit-btn">
                <span>{loading ? 'MENGIRIM...' : 'Kirim Link Reset ke Gmail'}</span>
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="forgot-modal-success-state">
            <div className="forgot-modal-icon-wrap success" ref={iconRef}>
              <span className="material-symbols-outlined">mark_email_read</span>
            </div>
            <h2 className="forgot-modal-title">Link Terkirim ke Gmail!</h2>
            <p className="forgot-modal-subtitle">
              Link reset kata sandi telah dikirim ke <strong className="email-highlight">{email}</strong>. 
              <br /><br />
              💡 <em>Silakan periksa <strong>Kotak Masuk (Inbox)</strong> atau folder <strong>Spam / Promosi</strong> di Gmail Anda.</em>
            </p>
            <button type="button" className="forgot-modal-submit-btn" onClick={onClose}>
              <span>Kembali ke Login</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
