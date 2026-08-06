import React from 'react';
import '../../styles/news/article.css';

// Import gambar dari folder assets
import mobilListrikImg from '../../assets/mobillistrik.jpg';

export default function News5() {
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
            Tanpa Emisi Knalpot, Tapi Bukan Tanpa Jejak Karbon: Apakah Mobil Listrik Benar-Benar Bebas Emisi dan Ramah Lingkungan?
          </h2>

          <div className="article-meta">
            <span>Topik: <strong className="meta-topic">Kendaraan Listrik & Transisi Energi</strong></span>
          </div>

          {/* GAMBAR DARI ASSETS */}
          <div className="article-image-wrapper">
            <img 
              src={mobilListrikImg} 
              alt="Mobil Listrik dan Pengisian Daya" 
              className="article-image"
            />
          </div>

          {/* KREDIT SUMBER DI BAWAH GAMBAR */}
          <p className="image-source-credit">
            Sumber Gambar:
            <a 
              href="https://unsplash.com/photos/a-man-working-on-a-car-engine-in-a-garage-nkdv9cqz9VE" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://unsplash.com/photos/a-man-working-on-a-car-engine-in-a-garage-nkdv9cqz9VE
            </a>
          </p>

          {/* PARAGRAF BACAAN */}
          <div className="article-body">
            <p className="article-paragraph">
              Secara operasional di jalan raya, mobil listrik memang <em>zero emission</em> karena tidak membakar bensin atau solar saat dijalankan. Hal ini sangat efektif mengurangi polusi udara lokal dan meningkatkan kualitas udara di perkotaan.
            </p>

            <p className="article-paragraph">
              Meski demikian, dampak lingkungan dari kendaraan listrik perlu dilihat dari keseluruhan siklus hidupnya (<em>life cycle analysis</em>), yang terbagi menjadi beberapa fase utama:
            </p>

            <ol className="article-list">
              <li>
                <strong>Proses Produksi dan Penambangan Baterai:</strong>
                <br />
                Proses manufaktur mobil listrik—khususnya pembuatan baterai <em>lithium-ion</em>—membutuhkan energi jauh lebih besar dibandingkan pembuatan mobil konvensional. Penambangan bahan mentah seperti litium, nikel, dan kobalt memerlukan proses ekstraksi yang masif, yang jika tidak dikelola dengan ketat dapat memicu degradasi lahan, pencemaran air lokal, serta emisi karbon tinggi pada tahap penambangan.
              </li>
              <li>
                <strong>Sumber Listrik Pengisian Daya:</strong>
                <br />
                Mobil listrik hanya bersih jika energi yang digunakan untuk mengisi baterainya berasal dari sumber yang bersih. Jika listrik yang diisikan ke kendaraan masih diproduksi oleh Pembangkit Listrik Tenaga Uap (PLTU) berbahan bakar batu bara, maka emisi karbon sebenarnya tidak hilang, melainkan berpindah (<em>shifted emission</em>) dari knalpot kendaraan ke cerobong pembangkit listrik.
              </li>
            </ol>

            <h3 className="article-subheading">Potensi Penurunan Emisi dalam Jangka Panjang</h3>

            <p className="article-paragraph">
              Meskipun memiliki jejak karbon awal yang tinggi saat diproduksi, mobil listrik tetap memiliki efisiensi energi yang jauh lebih baik dibandingkan mobil konvensional.
            </p>

            <p className="article-paragraph">
              Seiring berjalan nya waktu dan bertambahnya jarak tempuh, akumulasi emisi total mobil listrik akan menjadi jauh lebih rendah dibandingkan kendaraan berbahan bakar fosil. Selain itu, seiring dengan bertransisinya jaringan listrik nasional menuju Energi Baru Terbarukan (EBT) seperti panel surya dan tenaga angin, pengisian daya kendaraan listrik akan menjadi semakin hijau secara otomatis.
            </p>

            <h3 className="article-subheading">Tantangan Daur Ulang Baterai di Masa Depan</h3>

            <p className="article-paragraph">
              Tantangan lingkungan berikutnya terletak pada pengelolaan limbah baterai bekas. Baterai kendaraan listrik yang sudah habis masa pakainya harus didaur ulang secara efektif agar bahan kimia berbahaya tidak mencemari tanah dan air, sekaligus memungkinkan pemanfaatan kembali material bernilai tinggi seperti nikel dan litium untuk baterai baru.
            </p>
          </div>

        </article>
      </main>
    </div>
  );
}