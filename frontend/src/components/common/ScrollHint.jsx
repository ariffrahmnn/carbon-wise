import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollHint = ({ text = "Gulir ke bawah untuk lihat selengkapnya" }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Sembunyikan indikator jika user telah menggeser halaman > 100px
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollBy({ top: 350, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClick}
      className="mobile-scroll-hint"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        color: '#4a0e17',
        padding: '10px 18px',
        borderRadius: '30px',
        boxShadow: '0 8px 24px rgba(74, 14, 23, 0.22)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(74, 14, 23, 0.15)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '700',
        animation: 'bounceHint 2s infinite',
        userSelect: 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <span>{text}</span>
      <ChevronDown size={18} className="scroll-hint-arrow" />
      <style>{`
        @keyframes bounceHint {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-6px);
          }
          60% {
            transform: translateX(-50%) translateY(-3px);
          }
        }
        @media (min-width: 1024px) {
          .mobile-scroll-hint {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollHint;
