import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function HowToUse() {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '4rem 3rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          maxWidth: '800px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '3rem',
            color: '#4a0e17',
            marginBottom: '1rem',
            fontWeight: 800,
            letterSpacing: '-1px'
          }}>
            How To Use This WebSite
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
            Panduan lengkap mengenai cara menggunakan CarbonWiseCalc akan ditampilkan di sini.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
