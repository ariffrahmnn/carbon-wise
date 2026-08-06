import React, { useState, useEffect, useRef } from 'react';
import { X, User, School, GraduationCap, Mail, Calendar, Clock, BarChart3 } from 'lucide-react';
import gsap from 'gsap';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const StudentAnalyticsModal = ({ isOpen, onClose, studentProfile }) => {
  const [analyticsData, setAnalyticsData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState(false);

  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
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
      fetchStudentAnalytics(studentProfile.id);
    }
  }, [isOpen, studentProfile]);

  const fetchStudentAnalytics = async (studentId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/admin/students/${studentId}/analytics`, {
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

  return (
    <div className="modal-overlay" ref={overlayRef} style={{ zIndex: 1100 }} onClick={handleAnimatedClose}>
      <div 
        className="modal-content"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '850px',
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(74, 14, 23, 0.25)',
          position: 'relative'
        }}
      >
        <button 
          onClick={handleAnimatedClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { rotate: 90, scale: 1.1, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { rotate: 0, scale: 1, duration: 0.2 })}
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
              <h4 style={{ margin: '0 0 6px 0', color: '#4a0e17', fontSize: '1.05rem' }}>
                1. Grafik Emisi Harian (Hari Ini)
              </h4>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#666' }}>
                Tren pergerakan emisi CO₂ per jam input siswa di hari ini.
              </p>
              {analyticsData.daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={analyticsData.daily} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    <XAxis dataKey="formatted_time" stroke="#757575" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                    <RechartsTooltip formatter={(val) => `${parseFloat(val).toFixed(3)} kg CO₂`} />
                    <Line type="monotone" dataKey="total" stroke="#4a0e17" strokeWidth={2.5} dot={{ r: 4, fill: '#4a0e17' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.88rem' }}>Siswa ini belum memiliki masukan emisi di hari ini.</p>
              )}
            </div>

            {/* 2. Weekly Bar Chart */}
            <div style={{ background: '#fafafa', padding: '20px', borderRadius: '14px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#4a0e17', fontSize: '1.05rem' }}>
                2. Grafik Emisi Mingguan (7 Hari Terakhir)
              </h4>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#666' }}>
                Rekapitulasi total emisi per hari dalam 7 hari terakhir.
              </p>
              {analyticsData.weekly.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analyticsData.weekly} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    <XAxis dataKey="day_name" stroke="#757575" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#757575" style={{ fontSize: '11px' }} />
                    <RechartsTooltip formatter={(val) => `${parseFloat(val).toFixed(2)} kg CO₂`} />
                    <Bar dataKey="total" fill="#4a0e17" maxBarSize={40} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.88rem' }}>Data emisi mingguan masih kosong.</p>
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
