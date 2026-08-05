import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Printer } from 'lucide-react';

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
    <div className="modal-overlay">
      <div className="modal-content pie-modal-content">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        <h3 className="modal-title">Rincian Emisi Hari Ini</h3>
        
        {chartData.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="total"
                    nameKey="item_name"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    innerRadius={30}
                    paddingAngle={4}
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

            {/* Tombol Cetak PDF di bawah keterangan warna */}
            <div style={{ marginTop: '16px', textAlign: 'center', width: '100%' }}>
              <button 
                type="button" 
                className="btn-cetak-pdf"
                onClick={onExportPDF}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#4a0e17',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)',
                  transition: 'all 0.2s ease'
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
