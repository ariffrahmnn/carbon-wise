import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import gsap from 'gsap';

const ResetConfirmModal = ({ isOpen, onClose, expectedName, onConfirmReset, isLoading }) => {
  const [inputName, setInputName] = useState('');
  const modalCardRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setInputName('');
      // Animasi entrance modal
      gsap.fromTo(
        modalCardRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isNameMatched = inputName.trim().toLowerCase() === (expectedName || '').trim().toLowerCase();

  const handleTriggerSubmit = (e) => {
    e.preventDefault();

    if (!isNameMatched) {
      // 📳 ANIMASI GETAR GSAP SAAT INTEGRITAS INPUT TYPO / SALAH
      gsap.to(modalCardRef.current, {
        x: [-14, 14, -10, 10, -6, 6, -3, 3, 0],
        duration: 0.45,
        ease: 'power2.out'
      });
      return;
    }

    onConfirmReset();
  };

  return (
    <div className="modal-overlay">
      <div 
        ref={modalCardRef}
        className="modal-content reset-modal-card"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '460px',
          width: '90%',
          boxShadow: '0 15px 35px rgba(74, 14, 23, 0.2)',
          position: 'relative',
          border: '2px solid #ffebee'
        }}
      >
        <button 
          className="close-btn" 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <AlertTriangle size={30} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#b71c1c', fontWeight: 'bold' }}>
            Konfirmasi Reset Data (Keamanan Tingkat 2)
          </h3>
        </div>

        <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: '1.5', textAlign: 'center', marginBottom: '20px' }}>
          Tindakan ini akan <strong>menghapus secara permanen</strong> seluruh riwayat emisi makanan dan perjalanan Anda dari database. Data yang sudah dihapus tidak dapat dikembalikan.
        </p>

        <form onSubmit={handleTriggerSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Ketik nama Anda <span style={{ color: '#d32f2f' }}>"{expectedName}"</span> untuk memverifikasi:
            </label>
            <input 
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={`Contoh: ${expectedName}`}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: isNameMatched ? '2px solid #2e7d32' : '1.5px solid #ccc',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
            />
            {inputName.length > 0 && !isNameMatched && (
              <span style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                Nama belum cocok dengan akun Anda.
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: '1px solid #ccc',
                background: '#ffffff',
                color: '#555',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isNameMatched || isLoading}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: 'none',
                background: isNameMatched ? '#d32f2f' : '#ef9a9a',
                color: '#ffffff',
                fontWeight: '600',
                cursor: isNameMatched ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isNameMatched ? '0 4px 14px rgba(211, 47, 47, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Trash2 size={18} />
              {isLoading ? 'Mereset...' : 'Hapus Semua Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
