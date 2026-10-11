import React, { useState, useEffect, useRef } from 'react';
import { X, User, School, GraduationCap, Mail, Calendar, Clock, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { buildApiUrl } from '../../config/api.js';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// Sub-komponen Custom Tooltip Mingguan untuk Admin
const CustomWeeklyTooltip = React.memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dayName = data.day_name || '';
    const formattedDate = data.formatted_date || data.date || '';
    return (
      <div style={{
        background: '#ffffff',
        padding: '10px 14px',
        border: '1px solid #E0E0E0',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#4a0e17', fontSize: '0.92rem' }}>
          📅 {dayName} {formattedDate ? `(${formattedDate})` : ''}
        </p>
        <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '0.88rem' }}>
          Total Emisi: <strong style={{ color: '#4a0e17' }}>{parseFloat(data.total).toFixed(2)} kg CO₂</strong>
        </p>
      </div>
    );
  }
  return null;
});

const StudentAnalyticsModal = ({ isOpen, onClose, studentProfile }) => {
  const [analyticsData, setAnalyticsData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);

  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setWeekOffset(0);
      setDayOffset(0);
      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0, backdropFilter: 'blur(0px)' },
          { opacity: 1, backdropFilter: 'blur(8px)', duration: 0.3, ease: 'power2.out' }
        );

        gsap.fromTo(
          contentRef.current,
          { scale: 0.8, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.5)', delay: 0.05 }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  const handleAnimatedClose = () => {
    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }

    gsap.to(contentRef.current, { scale: 0.85, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose });
  };

  useEffect(() => {
    if (isOpen && studentProfile?.id) {
      fetchStudentAnalytics(studentProfile.id, weekOffset, dayOffset);
    }
  }, [isOpen, studentProfile, weekOffset, dayOffset]);

  const fetchStudentAnalytics = async (studentId, wOffset = 0, dOffset = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/v1/admin/students/${studentId}/analytics?weekOffset=${wOffset}&dayOffset=${dOffset}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        setAnalyticsData({
          daily: result.data.daily || [],
          weekly: result.data.weekly || [],
          monthly: result.data.monthly || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch student analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !studentProfile) return null;

  const weeklyList = analyticsData.weekly || [];

  return (
    <div 
      className="modal-overlay" 
      ref={overlayRef} 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
        boxSizing: 'border-box'
      }} 
      onClick={handleAnimatedClose}
    >
      <div 
        className="modal-content"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px 28px',
          maxWidth: '850px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          margin: 'auto'
        }}
      >
        <button 
          onClick={handleAnimatedClose}
          aria-label="Tutup Modal"
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#475569',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>

        {/* Profil Singkat Siswa */}
        <div style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#4a0e17', fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={24} style={{ color: '#4a0e17' }} /> Rekor Emisi: {studentProfile.full_name}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem', color: '#555' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <School size={16} /> <strong>Sekolah:</strong> {studentProfile.school_name || '-'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GraduationCap size={16} /> <strong>Kelas:</strong> {studentProfile.class_grade || '-'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={16} /> <strong>Email:</strong> {studentProfile.email || '-'}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}>
            Memuat grafik emisi siswa...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* 1. Daily Line Chart */}
            <div style={{ background: '#fafafa', padding: '20px', borderRadius: '14px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#4a0e17', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={18} /> 
                    1. Grafik Emisi Harian {analyticsData.daily.length > 0 && analyticsData.daily[0].formatted_date ? `(${analyticsData.daily[0].day_name}, ${analyticsData.daily[0].formatted_date})` : dayOffset === 0 ? '(Hari Ini)' : `(H-${dayOffset})`}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                    Tren pergerakan emisi CO₂ per jam input siswa di hari ini.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setDayOffset(prev => prev + 1)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #4a0e17',
                      background: '#ffffff',
                      color: '#4a0e17',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem'
                    }}
                    title="Lihat 1 hari sebelumnya"
                  >
                    <ChevronLeft size={15} /> Hari Sebelumnya
                  </button>
                  {dayOffset > 0 && (
                    <button
                      type="button"
                      onClick={() => setDayOffset(prev => Math.max(0, prev - 1))}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #4a0e17',
                        background: '#4a0e17',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem'
                      }}
                      title="Lihat hari yang lebih baru"
                    >
                      Hari Berikutnya <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              </div>

              {analyticsData.daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={analyticsData.daily} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    <XAxis dataKey="formatted_time" stroke="#757575" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                    <RechartsTooltip formatter={(val) => `${parseFloat(val).toFixed(2)} kg CO₂`} />
                    <Line type="monotone" dataKey="total" stroke="#4a0e17" strokeWidth={2.5} dot={{ r: 4, fill: '#4a0e17' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.88rem' }}>Siswa ini belum memiliki masukan emisi pada tanggal ini.</p>
              )}
            </div>

            {/* 2. Weekly Bar Chart dengan Navigasi Panah & Rentang Tanggal */}
            <div style={{ background: '#fafafa', padding: '20px', borderRadius: '14px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#4a0e17', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={18} /> 
                    2. Grafik Emisi Mingguan {weeklyList.length > 0 && weeklyList[0].formatted_date && weeklyList[weeklyList.length - 1].formatted_date ? `(${weeklyList[0].formatted_date} - ${weeklyList[weeklyList.length - 1].formatted_date})` : '(7 Hari Terakhir)'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                    Rekapitulasi total emisi per hari dalam rentang 1 minggu.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setWeekOffset(prev => prev + 1)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #4a0e17',
                      background: '#ffffff',
                      color: '#4a0e17',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem'
                    }}
                    title="Lihat 1 minggu sebelumnya"
                  >
                    <ChevronLeft size={15} /> Minggu Sebelumnya
                  </button>
                  {weekOffset > 0 && (
                    <button
                      type="button"
                      onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #4a0e17',
                        background: '#4a0e17',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem'
                      }}
                      title="Lihat minggu yang lebih baru"
                    >
                      Minggu Berikutnya <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              </div>

              {weeklyList.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyList} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    <XAxis dataKey="day_name" stroke="#757575" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                    <RechartsTooltip content={<CustomWeeklyTooltip />} />
                    <Bar dataKey="total" fill="#4a0e17" maxBarSize={40} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.88rem' }}>Data emisi minggu ini kosong.</p>
              )}
            </div>

            {/* 3. Monthly Bar Chart */}
            <div style={{ background: '#fafafa', padding: '20px', borderRadius: '14px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#360810', fontSize: '1.05rem' }}>
                3. Grafik Emisi Bulanan (Bulan Ini)
              </h4>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#666' }}>
                Rekapitulasi total emisi per pekan (Week 1 s.d. Week 4) di bulan berjalan.
              </p>
              {analyticsData.monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analyticsData.monthly} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    <XAxis dataKey="week" stroke="#757575" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                    <RechartsTooltip formatter={(val) => `${parseFloat(val).toFixed(2)} kg CO₂`} />
                    <Bar dataKey="total" fill="#360810" maxBarSize={40} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.88rem' }}>Data emisi bulanan masih kosong.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnalyticsModal;
