import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, Loader2 } from 'lucide-react';

const SaveStatusOverlay = ({ status, message = '' }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (status) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0, backdropFilter: 'blur(0px)' },
          { opacity: 1, backdropFilter: 'blur(6px)', duration: 0.25, ease: 'power2.out' }
        );

        gsap.fromTo(
          cardRef.current,
          { scale: 0.7, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
        );

        if (status === 'success' && iconRef.current) {
          gsap.fromTo(
            iconRef.current,
            { scale: 0, rotate: -45 },
            { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
          );
        }
      });

      return () => ctx.revert();
    }
  }, [status]);

  if (!status) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        ref={cardRef}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px 40px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '360px',
          width: '100%',
          border: '1px solid rgba(74, 14, 23, 0.08)'
        }}
      >
        {status === 'saving' && (
          <>
            <div style={{ animation: 'spin 1s linear infinite' }}>
              <Loader2 size={48} style={{ color: '#4a0e17' }} />
            </div>
            <h3 style={{ margin: 0, color: '#4a0e17', fontSize: '1.2rem', fontWeight: 700 }}>
              {message || 'Menyimpan Progress...'}
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              Mohon tunggu sejenak
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div ref={iconRef}>
              <CheckCircle2 size={56} style={{ color: '#16a34a' }} />
            </div>
            <h3 style={{ margin: 0, color: '#16a34a', fontSize: '1.25rem', fontWeight: 700 }}>
              {message || 'Berhasil Disimpan!'}
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
              Jejak karbon Anda telah tercatat dengan aman.
            </p>
          </>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SaveStatusOverlay;
