import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const AnalyticsPDFReport = ({
  userName,
  totalTodayEmissions,
  dailyList,
  todayBreakdownList,
  weeklyList,
  weeklyInsight,
  selectedMonth,
  selectedYear,
  monthlyList,
  monthlyInsight,
  MONTH_NAMES
}) => {
  return (
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
            Total Emisi Hari Ini: <strong style={{ color: '#4a0e17' }}>{totalTodayEmissions.toFixed(2)} kg CO₂</strong>
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
                    <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{parseFloat(item.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SECTION 2: GRAFIK & ANALISIS MINGGUAN */}
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

        {/* SECTION 3: GRAFIK & ANALISIS BULANAN */}
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
  );
};

export default React.memo(AnalyticsPDFReport);
