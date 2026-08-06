import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isOverDarkBg, setIsOverDarkBg] = useState(false);

  useEffect(() => {
    // Jalankan hanya untuk perangkat desktop (pointer fine)
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    if (!isDesktop) return;

    let reqId;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Deteksi elemen di bawah kursor
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        // Cek apakah elemen merupakan tombol/link/input interaktif
        const interactive = el.closest('button, a, input, select, textarea, [role="button"], .nav-item, .clickable');
        setIsHovered(!!interactive);

        // Cek warna background elemen di bawah kursor untuk deteksi area gelap/marun/cokelat
        const darkSection = el.closest('.calc-header, .nodecode-box, .about-hero, .btn-submit-all, .login-submit-btn, .analytics-back-home-btn:hover, [data-dark-bg="true"]');
        
        let isDark = false;
        if (darkSection) {
          isDark = true;
        } else {
          // Fallback check computed background color
          const computedStyle = window.getComputedStyle(el);
          const bg = computedStyle.backgroundColor;
          if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
            const rgb = bg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const r = parseInt(rgb[0]);
              const g = parseInt(rgb[1]);
              const b = parseInt(rgb[2]);
              // Hitung perceived luminance (jika gelap < 130)
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              if (brightness < 130) {
                isDark = true;
              }
            }
          }
        }
        setIsOverDarkBg(isDark);
      }
    };

    const animate = () => {
      // Smooth lerp (linear interpolation) 60fps
      currentX += (targetX - currentX) * 0.35;
      currentY += (targetY - currentY) * 0.35;
      setPos({ x: currentX, y: currentY });
      reqId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    reqId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-leaf-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: `translate3d(${pos.x - 12}px, ${pos.y - 12}px, 0) scale(${isHovered ? 1.35 : 1})`,
        transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease, filter 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        color: isOverDarkBg ? '#ffffff' : '#4A0E17',
        filter: isHovered 
          ? (isOverDarkBg ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'drop-shadow(0 0 8px rgba(74,14,23,0.4))') 
          : (isOverDarkBg ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 4px rgba(74,14,23,0.15))')
      }}
    >
      {/* Icon Daun CarbonWise Khas */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path
          d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
          stroke={isOverDarkBg ? '#4A0E17' : '#ffffff'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <style>{`
        @media (pointer: fine) {
          body, a, button, input, select, textarea {
            cursor: default !important;
          }
        }
        @media (max-width: 1023px), (pointer: coarse) {
          .custom-leaf-cursor {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomCursor;
