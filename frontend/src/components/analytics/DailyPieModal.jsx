import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Printer } from 'lucide-react';
import gsap from 'gsap';

// Pemetaan warna kontras dan indah khusus setiap item
const ITEM_COLORS = {
  'daging': '#E53935',    // Merah Tua
  'ayam': '#FF7043',      // Coral / Oranye Merah
  'ikan': '#0288D1',      // Biru Laut
  'telur': '#FBC02D',      // Kuning Telur
  'nasi': '#8D6E63',       // Cokelat Nasi
  'sayur': '#4CAF50',      // Hijau Segar
  'tahu': '#009688',       // Teal
  'tempe': '#FF9800',      // Oranye Matang
  'bus': '#1B5E20',        // Hijau Tua Bus
  'mobil': '#8E24AA',      // Ungu Mobil
  'motor': '#D84315',      // Oranye Karat Motor
  'jalan': '#00BCD4'       // Cyan Pejalan Kaki
};

const FALLBACK_COLORS = ['#3F51B5', '#E91E63', '#795548', '#607D8B', '#673AB7', '#8BC34A'];

const getItemColor = (itemName, index) => {
  if (!itemName) return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  const lowerName = itemName.toLowerCase();
  for (const [key, color] of Object.entries(ITEM_COLORS)) {
    if (lowerName.includes(key)) return color;
  }
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

const DailyPieModal = ({ isOpen, onClose, data, onExportPDF }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const chartRef = useRef(null);
  const btnRef = useRef(null);

  // Animasi GSAP saat Modal Terbuka
  useEffect(() => {
    if (isOpen) {
      const ctx = gsap.context(() => {
        // Overlay fade in
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0, backdropFilter: 'blur(0px)' },
          { opacity: 1, backdropFilter: 'blur(8px)', duration: 0.3, ease: 'power2.out' }
        );

        // Modal Box pop-up dengan efek spring/elastic back.out
        gsap.fromTo(
          contentRef.current,
          { scale: 0.75, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.5)', delay: 0.05 }
        );

        // Title staggered slide down
        gsap.fromTo(
          titleRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', delay: 0.2 }
        );

        // Chart container scale up
        if (chartRef.current) {
          gsap.fromTo(
            chartRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.25 }
          );
        }

        // Button pop up
        if (btnRef.current) {
          gsap.fromTo(
            btnRef.current,
            { y: 15, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)', delay: 0.35 }
          );
        }
      });

      return () => ctx.revert();
    }
  }, [isOpen]);

  // Handler penutupan dengan animasi smooth out
  const handleAnimatedClose = () => {
    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }

    gsap.to(contentRef.current, {
      scale: 0.85,
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: 'power2.in'
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  // Filter hanya item yang memiliki total emisi > 0 agar grafik bersih
  const chartData = data && data.length > 0 
    ? data
        .map(item => ({ 
          ...item, 
          total: parseFloat(item.total) 
        }))
        .filter(item => item.total > 0)
    : [];

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleAnimatedClose}>
      <div 
        className="modal-content pie-modal-content" 
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 25px 50px -12px rgba(74, 14, 23, 0.25)',
          background: '#ffffff',
          border: '1px solid rgba(74, 14, 23, 0.08)'
        }}
      >
        <button 
          className="close-btn" 
          onClick={handleAnimatedClose}
          style={{
            top: '20px',
            right: '20px',
            transition: 'transform 0.2s ease, color 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { rotate: 90, scale: 1.1, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { rotate: 0, scale: 1, duration: 0.2 })}
        >
          <X size={22} />
        </button>

        <h3 className="modal-title" ref={titleRef} style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1b4332', marginBottom: '16px' }}>
          Rincian Emisi Hari Ini
        </h3>
        
        {chartData.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div ref={chartRef} style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="total"
                    nameKey="item_name"
                    cx="50%"
                    cy="45%"
                    outerRadius={92}
                    innerRadius={32}
                    paddingAngle={4}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getItemColor(entry.item_name, index)} 
                        stroke="#ffffff" 
                        strokeWidth={2} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${parseFloat(value).toFixed(3)} kg CO₂`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tombol Cetak PDF dengan Animasi Hover GSAP */}
            <div ref={btnRef} style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
              <button 
                type="button" 
                className="btn-cetak-pdf"
                onClick={onExportPDF}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, translateY: -2, boxShadow: '0 8px 20px rgba(74, 14, 23, 0.35)', duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, translateY: 0, boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)', duration: 0.2 })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#4a0e17',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <Printer size={18} />
                Cetak PDF
              </button>
            </div>
          </div>
        ) : (
          <p className="no-data-text">Belum ada aktivitas emisi pada hari ini.</p>
        )}
      </div>
    </div>
  );
};

export default DailyPieModal;
