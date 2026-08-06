import React from 'react';
import '../../styles/news/article.css';

// Import gambar dari folder assets
import asalKarbonImg from '../../assets/asalkarbon.jpg';

export default function News6() {
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
            (CO₂) Karbon Dioksida, Kenali Bahaya dan Sumbernya
          </h2>

          <div className="article-meta">
            <span>Topik: <strong className="meta-topic">Emisi Karbon & Kesehatan Lingkungan</strong></span>
          </div>

          {/* GAMBAR DARI ASSETS */}
          <div className="article-image-wrapper">
            <img 
              src={asalKarbonImg} 
              alt="Sumber Emisi Karbon Dioksida" 
              className="article-image"
            />
          </div>

          {/* KREDIT SUMBER DI BAWAH GAMBAR */}
          <p className="image-source-credit">
            Sumber Gambar:
            <a 
              href="https://unsplash.com/photos/gray-and-red-factory-building-under-a-calm-blue-sky-9GwMIek9jnY" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://unsplash.com/photos/gray-and-red-factory-building-under-a-calm-blue-sky-9GwMIek9jnY
            </a>
          </p>

          {/* PARAGRAF BACAAN */}
          <div className="article-body">
            <p className="article-paragraph">
              Karbon Dioksida (CO<sub>2</sub>) merupakan gas tak berwarna dan tak berbau yang memiliki peran penting dalam atmosfer Bumi. Dalam kadar yang seimbang, gas ini dibutuhkan tumbuhan untuk proses fotosintesis dan membantu menjaga kehangatan suhu planet. Namun, peningkatan konsentrasi CO<sub>2</sub> yang berlebihan—baik di ruang tertutup maupun di atmosfer—dapat memicu dampak serius bagi kesehatan manusia hingga iklim global.
            </p>

            <h3 className="article-subheading">Sumber Utama Emisi CO₂</h3>

            <p className="article-paragraph">
              Peningkatan kadar karbon dioksida umumnya berasal dari dua sumber utama:
            </p>

            <ol className="article-list">
              <li>
                <strong>Aktivitas Manusia:</strong> Pembakaran bahan bakar fosil pada kendaraan bermotor, operasional pabrik industri, pembangkit listrik, serta aksi penebangan hutan (deforestasi) yang mengurangi penyerapan alami karbon.
              </li>
              <li>
                <strong>Proses Alami:</strong> Hasil respirasi makhluk hidup, proses pembusukan bahan organik, hingga aktivitas vulkanik gunung berapi.
              </li>
            </ol>

            <h3 className="article-subheading">Dampak Bahaya Terhadap Kesehatan dan Lingkungan</h3>

            <p className="article-paragraph">
              Memhirup udara dengan konsentrasi CO<sub>2</sub> tinggi di ruangan ber-AC atau ber-ventilasi buruk dapat memicu penurunan konsentrasi, pusing, hingga sakit kepala. Dalam skala yang lebih luas, penumpukan CO<sub>2</sub> di atmosfer menjadi penyumbang utama efek rumah kaca yang mempercepat pemanasan global dan perubahan iklim ekstrem.
            </p>
          </div>

        </article>
      </main>
    </div>
  );
}