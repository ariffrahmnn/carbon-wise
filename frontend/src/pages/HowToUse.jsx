import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function HowToUse() {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
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
          <div style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, textAlign: 'left', marginTop: '2rem' }}>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li>
                <strong>Akses Landing Page & Masuk ke Website</strong><br />
                Buka halaman utama web dan klik tombol MULAI SEKARANG untuk memulai.
              </li>
              <li>
                <strong>Buat Akun atau Masuk (Login / Register)</strong>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Pilih menu Create Account jika belum memiliki akun, lalu isi data diri seperti Nama Lengkap, Email/Gmail, Kata Sandi, Nama Sekolah, dan Kelas.</li>
                  <li>Jika sudah memiliki akun, masuk melalui menu Log in menggunakan Email dan Kata Sandi atau opsi Log in with Google.</li>
                </ul>
              </li>
              <li>
                <strong>Catat Aktivitas Konsumsi Makanan</strong><br />
                Pilih menu Makanan di navigasi samping.
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Pilih jenis makanan yang Anda konsumsi (seperti Ayam, Daging, Ikan, Nasi, Sayur, Tahu, Telur, atau Tempe) dan tekan button tambah ke "Daftar makanan terpilih".</li>
                  <li>Cek daftar makanan terpilih, lalu klik tombol Simpan untuk mencatat estimasi emisi karbon makanan Anda.</li>
                </ul>
              </li>
              <li>
                <strong>Catat Aktivitas Perjalanan (Travel)</strong><br />
                Pilih menu Travel di navigasi samping.
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Pilih jenis kendaraan yang digunakan (Bus, Jalan Kaki, Mobil, atau Motor) beserta jarak tempuhnya dan tekan button tambah ke "Daftar perjalanan terpilih".</li>
                  <li>Cek rincian perjalanan, lalu klik tombol Simpan untuk menghitung estimasi emisi perjalanan Anda.</li>
                </ul>
              </li>
              <li>
                <strong>Pantau Analisis Karbon Harian</strong>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Buka menu Grafik untuk melihat pergerakan emisi harian Anda dalam bentuk garis tren per jam.</li>
                  <li>Klik pada titik mana saja di grafik harian untuk membuka modal Rincian Emisi yang menampilkan persentase kontribusi emisi (misalnya Bus vs Mobil) beserta tombol untuk Cetak PDF.</li>
                </ul>
              </li>
              <li>
                <strong>Evaluasi Tren Emisi Mingguan & Bulanan</strong>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><strong>Grafik Mingguan:</strong> Lihat rekap emisi 7 hari terakhir beserta Catatan Hangat yang memberikan umpan balik dan dorongan positif untuk aktivitas harian Anda.</li>
                  <li><strong>Grafik Bulanan:</strong> Pilih bulan tertentu pada dropdown untuk memantau rekap total emisi per minggu, serta melihat Apresiasi Bulanan atas upaya yang telah Anda lakukan.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
