import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Leaf, BarChart3, Navigation, LogOut, PenTool, Sparkles, Heart, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

import DailyPieModal from '../components/analytics/DailyPieModal.jsx';
import ResetConfirmModal from '../components/analytics/ResetConfirmModal.jsx';
import { exportAnalyticsToPDF } from '../utils/pdfGenerator.js';

import '../styles/headerkalkulator.css';
import '../styles/shared/footer.css';
import '../styles/travel.css';
import '../styles/analytics.css';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  
  const [analyticsData, setAnalyticsData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    todayBreakdown: []
  });
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResettingData, setIsResettingData] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    fetchAnalyticsData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const fetchAnalyticsData = async (m = selectedMonth, y = selectedYear) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/emissions/analytics?month=${m}&year=${y}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        setAnalyticsData({
          daily: result.data.daily || [],
          weekly: result.data.weekly || [],
          monthly: result.data.monthly || [],
          todayBreakdown: result.data.todayBreakdown || []
        });
        
        // GSAP Animation: Animasi elemen naik perlahan
        gsap.fromTo(
          '.chart-card',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
        );
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const userName = user?.fullName || user?.name || user?.username || 'User';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const dailyList = analyticsData?.daily || [];
  const weeklyList = analyticsData?.weekly || [];
  const monthlyList = analyticsData?.monthly || [];
  const todayBreakdownList = analyticsData?.todayBreakdown || [];

  // Handler Konfirmasi Reset Data (Keamanan Tingkat 2)
  const handleResetConfirm = async () => {
    setIsResettingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/emissions/reset', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setIsResetModalOpen(false);
        await fetchAnalyticsData(selectedMonth, selectedYear);
      } else {
        alert(result.message || 'Gagal mereset data emisi!');
      }
    } catch (err) {
      console.error('Failed to reset data:', err);
      alert('Terjadi kesalahan koneksi atau server mati!');
    } finally {
      setIsResettingData(false);
    }
  };

  // Custom Dot untuk Grafik Garis Harian
  const CustomDot = (props) => {
    const { cx, cy, index } = props;
    const isLast = index === dailyList.length - 1;
    
    if (isLast) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          <circle cx="10" cy="10" r="6" fill="#ff4d4f" stroke="#fff" strokeWidth="2" />
          <circle cx="10" cy="10" r="14" fill="transparent" stroke="#ff4d4f" strokeWidth="1" strokeDasharray="3 3">
            <animate attributeName="r" from="6" to="16" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      );
    }
    return <circle cx={cx} cy={cy} r={4} fill="#4a0e17" stroke="#fff" strokeWidth={2} />;
  };

  // Hitung total emisi gabungan dari data hari ini
  const totalTodayEmissions = dailyList.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);

  // LOGIKA KOMPLIMEN MINGGUAN (Friendly & Menenangkan)
  const getWeeklyInsight = () => {
    if (!weeklyList || weeklyList.length < 2) {
      return {
        type: 'info',
        message: 'Terima kasih telah konsisten mencatat emisi karbon harianmu! Setiap data yang kamu catat membantu kita lebih peka terhadap kelestarian lingkungan. Tetap semangat ya! 🌿✨'
      };
    }

    const todayVal = parseFloat(weeklyList[weeklyList.length - 1]?.total || 0);
    const prevVal = parseFloat(weeklyList[weeklyList.length - 2]?.total || 0);

    if (todayVal < prevVal) {
      const diff = (prevVal - todayVal).toFixed(2);
      return {
        type: 'praise',
        message: `Luar biasa sekali! Hari ini kamu berhasil menghemat emisi karbon sebesar ${diff} kg CO₂ dibanding kemarin. Langkah kecil yang kamu ambil hari ini memberikan napas segar bagi bumi kita. Terima kasih telah peduli! 🌱💚`
      };
    } else if (todayVal > prevVal) {
      const diff = (todayVal - prevVal).toFixed(2);
      return {
        type: 'reminder',
        message: `Tidak apa-apa, hari ini emisi karbonmu sedikit meningkat (+${diff} kg CO₂ dibanding kemarin). Perjalanan menjaga bumi memang naik dan turun. Yang terpenting adalah kamu selalu peka dan berusaha. Besok kita bisa mencoba memilih transportasi yang lebih ramah atau hemat energi bersama-sama! 🌸🕊️`
      };
    } else {
      return {
        type: 'stable',
        message: 'Tingkat emisi kamu stabil dibanding kemarin. Konsistensi dalam menjaga pola konsumsi dan mobilitas yang ramah lingkungan sudah sangat hebat! 🍃😊'
      };
    }
  };

  // LOGIKA KOMPLIMEN BULANAN
  const getMonthlyInsight = () => {
    if (!monthlyList || monthlyList.length < 2) {
      return {
        message: `Rekap emisi bulan ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} tercatat dengan baik. Mari kita jadikan bulan ini lebih bersih dan hijau dari bulan sebelumnya! 🌟`
      };
    }

    const currWeek = parseFloat(monthlyList[monthlyList.length - 1]?.total || 0);
    const prevWeek = parseFloat(monthlyList[monthlyList.length - 2]?.total || 0);

    if (currWeek < prevWeek) {
      return {
        message: `Kinerja yang sungguh menginspirasi di bulan ${MONTH_NAMES[selectedMonth - 1]}! Emisi di minggu ini menurun signifikan dibanding minggu sebelumnya. Usaha konsistenmu membuktikan gaya hidup ramah lingkungan itu menyenangkan! 🌎🍀`
      };
    } else {
      return {
        message: `Minggu ini di bulan ${MONTH_NAMES[selectedMonth - 1]} mungkin aktivitasmu sedikit lebih padat. Jangan berkecil hati ya, mari pelan-pelan evaluasi pilihan konsumsi dan perjalanan minggu depan dengan santai dan gembira. 💖🌿`
      };
    }
  };

  const weeklyInsight = getWeeklyInsight();
  const monthlyInsight = getMonthlyInsight();

  // Fungsi Ekspor PDF
  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    await exportAnalyticsToPDF('printable-analytics-report', `Laporan_Analisis_Karbon_${userName.replace(/\s+/g, '_')}.pdf`);
    setIsGeneratingPDF(false);
  };

  // Custom Tooltip untuk Grafik Harian
  const CustomDailyTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: '#ffffff',
          padding: '10px 14px',
          border: '1px solid #E0E0E0',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#1B5E20', fontSize: '0.95rem' }}>
            {data.day_name}, {data.formatted_date}
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '0.9rem' }}>
            Pukul: <strong>{data.formatted_time}</strong>
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#4a0e17', fontWeight: '600', fontSize: '0.95rem' }}>
            Total Emisi: {parseFloat(data.total).toFixed(3)} kg CO₂
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="layout-wrapper" ref={containerRef}>
      {/* HEADER SECTION */}
      <header className="calc-header">
        <div className="calc-header-left">
          <div className="calc-brand">
            <div className="calc-logo-icon">
              <Leaf size={20} />
            </div>
            <span className="calc-brand-title">CarbonWise</span>
          </div>

          <div className="calc-total-emissions-badge">
            <span>Total Emisi:</span>
            <strong>{totalTodayEmissions > 0 ? `${totalTodayEmissions.toFixed(3)} kg CO₂` : '0.000 kg CO₂'}</strong>
          </div>
        </div>

        <div className="calc-header-right">
          <div className="calc-user-profile">
            <div className="calc-avatar">{userInitial}</div>
            <span className="calc-user-name">{userName}</span>
          </div>

          <button 
            className="calc-btn-logout" 
            title="Keluar" 
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="main-body">
        {/* SIDEBAR SECTION */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <Link to="/" className="nav-item">
              <Home size={22} />
              <span>Home</span>
            </Link>
            <Link to="/input" className="nav-item">
              <PenTool size={22} />
              <span>Makanan</span>
            </Link>
            <Link to="/travel" className="nav-item">
              <Navigation size={22} />
              <span>Travel</span>
            </Link>
            <Link to="/analytics" className="nav-item active">
              <BarChart3 size={22} />
              <span>Grafik</span>
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="content-area">
          <button
            type="button"
            className="auth-back-home-btn"
            onClick={() => navigate('/')}
            style={{ marginBottom: '20px', border: 'none', background: 'transparent' }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Beranda
          </button>

          <h1 className="page-title" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>Analisis Karbon</h1>
          <p className="page-subtitle" style={{ color: '#666', marginBottom: '30px' }}>Pantau jejak emisi harian, mingguan, dan bulanan Anda di sini.</p>
          
          <div className="charts-grid">
            {/* 1. Daily Line Chart */}
            <div className="chart-card">
              <h3>Grafik Harian (Hari Ini)</h3>
              <p className="chart-desc">Pergerakan emisi Anda per jam. Klik titik merah terakhir untuk detail komposisi emisi!</p>
              <div className="chart-container">
                {dailyList.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={dailyList} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="formatted_time" stroke="#757575" />
                      <YAxis stroke="#757575" />
                      <RechartsTooltip content={<CustomDailyTooltip />} />
                      <Line type="monotone" dataKey="total" stroke="#4a0e17" strokeWidth={3} dot={<CustomDot />} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="no-data-text" style={{ padding: '40px 0' }}>Belum ada aktivitas emisi di hari ini.</p>
                )}
              </div>

              {/* Rincian Masukan Harian (Persentase & Jam Input) */}
              {dailyList.length > 0 && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#F9FBE7', borderRadius: '12px', border: '1px solid #DCEDC8' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#33691E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} /> Rincian Waktu & Masukan Hari Ini
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {dailyList.map((item, idx) => (
                      <div key={idx} style={{ background: '#ffffff', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E0E0E0', fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#4a0e17' }}>Pukul {item.formatted_time}:</span> {parseFloat(item.total).toFixed(3)} kg CO₂
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Weekly Bar Chart & Friendly Compliment */}
            <div className="chart-card">
              <h3>Grafik Mingguan (7 Hari Terakhir)</h3>
              <p className="chart-desc">Rekap total emisi harian Anda dalam satu minggu ke belakang.</p>
              <div className="chart-container">
                {weeklyList.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={weeklyList} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="day_name" stroke="#757575" />
                      <YAxis stroke="#757575" />
                      <RechartsTooltip formatter={(value) => `${parseFloat(value).toFixed(2)} kg CO₂`} />
                      <Bar dataKey="total" fill="#4a0e17" maxBarSize={45} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="no-data-text" style={{ padding: '40px 0' }}>Data mingguan masih kosong.</p>
                )}
              </div>

              {/* Komplimen Ramah Lingkungan Mingguan */}
              <div style={{
                marginTop: '20px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                borderRadius: '14px',
                color: '#1B5E20',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <Heart size={22} style={{ color: '#2E7D32', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.98rem', display: 'block', marginBottom: '4px' }}>Catatan Hangat Hari Ini:</strong>
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.5' }}>{weeklyInsight.message}</p>
                </div>
              </div>
            </div>

            {/* 3. Monthly Bar Chart & Compliment dengan DROPDOWN FILTER BULAN */}
            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>Grafik Bulanan ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})</h3>
                
                {/* DROPDOWN SELECT BULAN */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.88rem', color: '#555', fontWeight: '500' }}>Pilih Bulan:</label>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #4a0e17',
                      color: '#4a0e17',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={idx} value={idx + 1}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="chart-desc">Rekap total emisi mingguan Anda dalam bulan {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.</p>
              <div className="chart-container">
                {monthlyList.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={monthlyList} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="week" stroke="#757575" />
                      <YAxis stroke="#757575" />
                      <RechartsTooltip formatter={(value) => `${parseFloat(value).toFixed(2)} kg CO₂`} />
                      <Bar dataKey="total" fill="#360810" maxBarSize={45} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="no-data-text" style={{ padding: '40px 0' }}>Data bulanan pada bulan {MONTH_NAMES[selectedMonth - 1]} {selectedYear} masih kosong.</p>
                )}
              </div>

              {/* Komplimen Ramah Lingkungan Bulanan */}
              <div style={{
                marginTop: '20px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                borderRadius: '14px',
                color: '#4A148C',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <Sparkles size={22} style={{ color: '#7B1FA2', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.98rem', display: 'block', marginBottom: '4px' }}>Apresiasi Bulanan ({MONTH_NAMES[selectedMonth - 1]}):</strong>
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.5' }}>{monthlyInsight.message}</p>
                </div>
              </div>

              {/* Tombol Reset Data (Tengah di bawah kotak ungu) */}
              <div style={{ marginTop: '28px', textAlign: 'center', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#d32f2f',
                    color: '#ffffff',
                    padding: '11px 28px',
                    borderRadius: '30px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(211, 47, 47, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Trash2 size={18} />
                  Reset Semua Data
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Pie Chart dengan Tombol Cetak PDF */}
      <DailyPieModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={todayBreakdownList} 
        onExportPDF={handleExportPDF}
      />

      {/* Modal Konfirmasi Reset Data (Keamanan Tingkat 2 & Animasi Getar GSAP) */}
      <ResetConfirmModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        expectedName={userName}
        onConfirmReset={handleResetConfirm}
        isLoading={isResettingData}
      />

      {/* TEMPLATE TERSEMBUNYI KHUSUS CETAK PDF LAPORAN RESMI */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="printable-analytics-report" style={{ width: '800px', padding: '40px', background: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#333333' }}>
          {/* Header PDF */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4a0e17', paddingBottom: '16px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ margin: 0, color: '#4a0e17', fontSize: '24px', fontWeight: 'bold' }}>CarbonWise - Laporan Analisis Emisi</h1>
              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>Laporan Resmi Grafik Jejak Karbon Harian, Mingguan, & Bulanan</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#555' }}>
              <p style={{ margin: 0 }}><strong>Pengguna:</strong> {userName}</p>
              <p style={{ margin: '2px 0 0 0' }}><strong>Dicetak:</strong> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* SECTION 1: GRAFIK & RINCIAN HARIAN */}
          <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
            <h3 style={{ color: '#4a0e17', borderBottom: '1.5px solid #4a0e17', paddingBottom: '6px', fontSize: '16px', marginBottom: '12px' }}>
              1. Grafik & Rincian Emisi Harian (Hari Ini)
            </h3>
            <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#555' }}>
              Total Emisi Hari Ini: <strong style={{ color: '#4a0e17' }}>{totalTodayEmissions.toFixed(3)} kg CO₂</strong>
            </p>
            
            {/* Visual Grafik Harian LineChart */}
            {dailyList.length > 0 && (
              <div style={{ width: '720px', height: '180px', marginBottom: '16px', background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                <LineChart width={700} height={170} data={dailyList} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="formatted_time" stroke="#757575" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="total" stroke="#4a0e17" strokeWidth={2.5} dot={{ r: 4, fill: '#4a0e17' }} />
                </LineChart>
              </div>
            )}

            {/* Tabel Item Rincian */}
            {todayBreakdownList.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#4a0e17', color: '#ffffff', textAlign: 'left' }}>
                    <th style={{ padding: '6px 10px', border: '1px solid #4a0e17' }}>Sumber / Item</th>
                    <th style={{ padding: '6px 10px', border: '1px solid #4a0e17' }}>Kategori</th>
                    <th style={{ padding: '6px 10px', border: '1px solid #4a0e17' }}>Total Emisi (kg CO₂)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayBreakdownList.map((item, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#fcfcfc' }}>
                      <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{item.item_name}</td>
                      <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{item.category_name}</td>
                      <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{parseFloat(item.total).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* SECTION 2: GRAFIK & ANALISIS MINGGUAN DENGAN DETAIL MINGGU/BULAN */}
          <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
            <h3 style={{ color: '#4a0e17', borderBottom: '1.5px solid #4a0e17', paddingBottom: '6px', fontSize: '16px', marginBottom: '6px' }}>
              2. Grafik & Analisis Emisi Mingguan (Pekan Ke-{Math.ceil(new Date().getDate() / 7)}, Bulan {MONTH_NAMES[new Date().getMonth()]} {new Date().getFullYear()})
            </h3>
            <p style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#666' }}>
              Pelacakan emisi 7 hari terakhir dalam rentang pekan aktif saat ini.
            </p>
            
            {/* Visual Grafik Mingguan BarChart */}
            {weeklyList.length > 0 && (
              <div style={{ width: '720px', height: '180px', marginBottom: '12px', background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                <BarChart width={700} height={170} data={weeklyList} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="day_name" stroke="#757575" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                  <Bar dataKey="total" fill="#4a0e17" maxBarSize={35} radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>
            )}

            {/* Kotak Analisis & Komplimen Mingguan */}
            <div style={{ background: '#e8f5e9', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #2e7d32', fontSize: '12.5px', color: '#1b5e20', lineHeight: '1.5' }}>
              <strong style={{ display: 'block', marginBottom: '2px', color: '#2e7d32' }}>Analisis & Komplimen Mingguan:</strong>
              {weeklyInsight.message}
            </div>
          </div>

          {/* SECTION 3: GRAFIK & ANALISIS BULANAN DENGAN DETAIL BULAN/TAHUN */}
          <div style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
            <h3 style={{ color: '#4a0e17', borderBottom: '1.5px solid #4a0e17', paddingBottom: '6px', fontSize: '16px', marginBottom: '6px' }}>
              3. Grafik & Analisis Emisi Bulanan (Bulan {MONTH_NAMES[selectedMonth - 1]} {selectedYear})
            </h3>
            <p style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#666' }}>
              Rekapitulasi total emisi per pekan (Week 1 s.d. Week 4) pada bulan {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
            </p>
            
            {/* Visual Grafik Bulanan BarChart */}
            {monthlyList.length > 0 && (
              <div style={{ width: '720px', height: '180px', marginBottom: '12px', background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                <BarChart width={700} height={170} data={monthlyList} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="week" stroke="#757575" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                  <Bar dataKey="total" fill="#360810" maxBarSize={35} radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>
            )}

            {/* Kotak Analisis & Apresiasi Bulanan */}
            <div style={{ background: '#f3e5f5', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #7b1fa2', fontSize: '12.5px', color: '#4a148c', lineHeight: '1.5' }}>
              <strong style={{ display: 'block', marginBottom: '2px', color: '#7b1fa2' }}>Analisis & Apresiasi Bulanan:</strong>
              {monthlyInsight.message}
            </div>
          </div>

          {/* Footer Dokumen PDF */}
          <div style={{ marginTop: '30px', paddingTop: '14px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '11px', color: '#888' }}>
            Laporan ini secara otomatis dibuat oleh sistem CarbonWise. Mari terus lestarikan bumi bersama-sama. 🌱
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
