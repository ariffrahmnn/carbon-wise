import React from 'react';
import '../../styles/news/article.css';

// Import gambar dari folder assets
import kapalImg from '../../assets/kapal.jpg';

export default function News2() {
  return (
    <div className="news-page-container">
      {/* HEADER SECTION */}
      <header className="news-header-section">
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
            Food Miles: Seberapa Jauh Makananmu Bepergian Sebelum Sampai di Piring?
          </h2>

          <div className="article-meta">
            <span>Topik: <strong className="meta-topic">Jejak Karbon & Konsumsi Pangan</strong></span>
          </div>

          {/* GAMBAR DARI ASSETS */}
          <div className="article-image-wrapper">
            <img 
              src={kapalImg} 
              alt="Distribusi Pangan Laut dan Udara" 
              className="article-image"
            />
          </div>

          {/* KREDIT SUMBER DI BAWAH GAMBAR */}
          <p className="image-source-credit">
            Sumber Gambar:
            <a 
              href="https://unsplash.com/photos/aerial-view-of-blue-and-white-boat-on-body-of-water-during-daytime-FPKnAO-CF6M" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://unsplash.com/photos/aerial-view-of-blue-and-white-boat-on-body-of-water-during-daytime-FPKnAO-CF6M
            </a>
          </p>

          {/* PARAGRAF BACAAN */}
          <div className="article-body">
            <p className="article-paragraph">
              <em>Food miles</em> mengacu pada total jarak geografis yang ditempuh suatu produk makanan—mulai dari lokasi pertanian atau tempat produksi awal, proses pengolahan di pabrik, distribusi antarnegara, hingga tiba di pasar swalayan dan dapur rumah tangga.
            </p>

            <p className="article-paragraph">
              Setiap tahap perjalanan ini hampir selalu melibatkan moda transportasi yang membakar bahan bakar fosil, seperti kapal kargo, pesawat udara, dan truk pendingin. Proses distribusi berskala global ini melepaskan emisi gas rumah kaca dalam jumlah besar, terutama Karbon Dioksida (CO<sub>2</sub>) dan Metana (CH<sub>4</sub>) dari sistem pendingin.
            </p>

            <p className="article-paragraph">
              Pengangkutan produk makanan impor menggunakan pesawat udara bahkan dapat menghasilkan emisi karbon hingga 50 kali lebih besar dibandingkan pengiriman menggunakan jalur darat lokal untuk berat bahan pangan yang sama.
            </p>

            <h3 className="article-subheading">
              Langkah Sederhana Memangkas Food Miles di Dapur Anda
            </h3>

            <p className="article-paragraph">
              Meminimalkan jejak karbon dari rantai pasok makanan tidak sulit untuk diterapkan. Beberapa langkah praktis yang bisa Anda lakukan mulai hari ini antara lain:
            </p>

            <ol className="article-list">
              <li>
                <strong>Utamakan Bahan Pangan Lokal:</strong> Belilah sayur, buah, dan kebutuhan pokok yang diproduksi oleh petani atau usaha lokal di sekitar wilayah Anda.
              </li>
              <li>
                <strong>Konsumsi Makanan Sesuai Musim:</strong> Buah dan sayuran lokal yang dipanen sesuai musimnya tidak membutuhkan rumah kaca bertenaga tinggi atau pengiriman impor khusus.
              </li>
              <li>
                <strong>Kurangi Ketergantungan pada Produk Impor:</strong> Pilih alternatif bahan makanan lokal yang memiliki kandungan gizi dan cita rasa serupa.
              </li>
              <li>
                <strong>Manfaatkan Pekarangan Rumah:</strong> Menanam bumbu dapur sederhana seperti cabai, tomat, atau daun bawang di pot rumah dapat memotong perjalanan bahan makanan menjadi nol kilometer.
              </li>
            </ol>
          </div>

        </article>
      </main>
    </div>
  );
}