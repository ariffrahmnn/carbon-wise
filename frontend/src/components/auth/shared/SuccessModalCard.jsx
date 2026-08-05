import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../../../styles/auth/shared/success-modal.css';

export default function SuccessModalCard({ isOpen, title, message, buttonText, onConfirm }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
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

      // Elastic checkmark badge spin
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotate: -60 },
        { scale: 1, rotate: 0, duration: 0.65, delay: 0.15, ease: 'elastic.out(1.2, 0.4)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" ref={overlayRef}>
      <div className="success-modal-card" ref={cardRef}>
        <div className="success-modal-icon-wrap" ref={iconRef}>
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <h2 className="success-modal-title">{title || 'Berhasil!'}</h2>
        <p className="success-modal-message">
          {message || 'Proses Anda telah berhasil diselesaikan dengan baik.'}
        </p>
        <button
          type="button"
          className="success-modal-confirm-btn"
          onClick={onConfirm}
        >
          <span>{buttonText || 'Lanjutkan'}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
