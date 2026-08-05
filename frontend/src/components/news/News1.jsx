import React from 'react';
import '../../styles/news/article.css';

// Import gambar dari folder assets
import kemacetanImg from '../../assets/kemacetan.jpg';

export default function News1() {
  return (
    <div className="news-page-container">
      {/* HEADER SECTION */}
      <header className="news-header-section">
        <span className="news-tagline">CERITA TERBARU</span>
        <h1 className="news-main-title">News & Insights</h1>
        <p className="news-subtitle">
          Ikuti kabar dan insight terbaru seputar iklim, alam, dan langkah kecil yang bisa kita mulai hari ini.
        </p>
      </header>

      {/* MAIN ARTICLE CARD */}
      <main className="news-content-card">
        <article className="news-article">
          
          {/* Judul Utama Artikel */}
          <h2 className="article-title">
            Emisi dari Sektor Transportasi: Seberapa Besar Dampak Perjalanan Harian Kita?
          </h2>

          <div className="article-meta">
            <span></span>  <span>Topik: Impilkasi Penggunaan Transportasi</span>
          </div>

          {/* GAMBAR DARI ASSETS */}
          <div className="article-image-wrapper">
            <img 
              src={kemacetanImg} 
              alt="Emisi Kendaraan Transportasi" 
              className="article-image"
            />
          </div>

          {/* PARAGRAF BACAAN */}
          <div className="article-body">
            <p className="article-paragraph">
              Setiap kali kita menyalakan mesin kendaraan bermotor untuk berangkat kerja, sekolah, atau sekadar bepergian, ada proses pembakaran bahan bakar yang menghasilkan gas buang ke udara. Di kawasan perkotaan, sektor transportasi memegang porsi sangat besar dalam menyumbang emisi gas rumah kaca, terutama Karbon Dioksida (CO<sub>2</sub>).
            </p>

            <h3 className="article-subheading">
              Mengapa Transportasi Menghasilkan Emisi Karbon?
            </h3>

            <p className="article-paragraph">
              Mayoritas kendaraan bermotor di jalan raya masih bergantung pada bahan bakar fosil seperti bensin dan diesel. Saat bahan bakar ini dibakar di dalam mesin, terjadi reaksi kimia yang melepaskan energi sekaligus menghasilkan produk sampingan berupa gas CO<sub>2</sub>, karbon monoksida (CO), serta partikel berbahaya lainnya.
            </p>

            <p className="article-paragraph">
              Secara rata-rata, pembakaran 1 liter bensin dapat menghasilkan sekitar 2,3 kg CO<sub>2</sub> ke atmosfer. Semakin jauh jarak tempuh dan semakin tidak efisien kendaraan yang digunakan, semakin besar pula jejak karbon yang kita tinggalkan.
            </p>
          </div>

        </article>
      </main>
    </div>
  );
}