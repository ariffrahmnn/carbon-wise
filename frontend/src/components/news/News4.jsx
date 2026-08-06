import React from 'react';
import '../../styles/news/article.css';

// Import gambar dari folder assets
import sampahImg from '../../assets/sampah.jpg';

export default function News4() {
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
            Komposting Sampah Dapur: Langkah Mudah Cegah Gas Metana di TPA
          </h2>

          <div className="article-meta">
            <span>Topik: <strong className="meta-topic">Pengelolaan Sampah & Emisi Gas Rumah Kaca</strong></span>
          </div>

          {/* GAMBAR DARI ASSETS */}
          <div className="article-image-wrapper">
            <img 
              src={sampahImg} 
              alt="Pengelolaan Sampah Dapur dan Komposting" 
              className="article-image"
            />
          </div>

          {/* KREDIT SUMBER DI BAWAH GAMBAR */}
          <p className="image-source-credit">
            Sumber Gambar :
            <a 
              href="https://unsplash.com/photos/garbage-near-forest-7_TSzqJms4w" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://unsplash.com/photos/garbage-near-forest-7_TSzqJms4w
            </a>
          </p>

          {/* PARAGRAF BACAAN */}
          <div className="article-body">
            <p className="article-paragraph">
              Sisa sayuran, kulit buah, dan sisa makanan sehari-hari sering kali dianggap sebagai sampah biasa yang tinggal dibuang begitu saja. Padahal, ketika sampah organik berakhir dan tertimbun di Tempat Pemrosesan Akhir (TPA), terjadi reaksi kimia yang berdampak serius terhadap perubahan iklim.
            </p>

            <h3 className="article-subheading">Ancaman Gas Metana dari TPA</h3>

            <p className="article-paragraph">
              Di TPA, sampah organik menumpuk dan tertutup oleh berbagai jenis sampah lainnya. Kondisi yang minim oksigen ini memicu pembusukan secara <em>anaerob</em> (tanpa udara).
            </p>

            <p className="article-paragraph">
              Proses pembusukan anaerobik ini melepaskan gas Metana (CH<sub>4</sub>), sebuah gas rumah kaca berbahaya yang memiliki kemampuan menangkap panas di atmosfer hingga 28 kali lebih kuat dibandingkan Karbon Dioksida (CO<sub>2</sub>) dalam skala jangka panjang.
            </p>

            <p className="article-paragraph">
              <strong>Fakta Lingkungan:</strong> Sampah organik menyumbang lebih dari 50% dari total volume sampah rumah tangga. Jika tidak dikelola langsung dari sumbernya, TPA akan terus menjadi salah satu pemicu emisi gas rumah kaca terbesar.
            </p>

            <h3 className="article-subheading">Komposting: Solusi Sederhana Mengubah Dampak Buruk Jadi Manfaat</h3>

            <p className="article-paragraph">
              Komposting adalah teknik penguraian bahan organik secara <em>aerob</em> (membutuhkan oksigen) dengan bantuan mikroorganisme alami. Berbeda dengan proses pembusukan di TPA, komposting secara terbuka tidak menghasilkan gas metana, melainkan mengubah sisa makanan menjadi pupuk kompos yang subur untuk tanah dan tanaman.
            </p>

            <h3 className="article-subheading">Langkah Mudah Memulai Komposting Mandiri di Rumah</h3>

            <p className="article-paragraph">
              Mengolah sampah dapur menjadi kompos tidak membutuhkan lahan luas atau alat yang rumit. Berikut langkah-langkah praktisnya:
            </p>

            <ol className="article-list">
              <li>
                <strong>Kumpulkan Bahan Hijau dan Cokelat:</strong> Campurkan materi hijau (sisa sayur, kulit buah, ampas kopi) yang kaya nitrogen dengan materi cokelat (dedaunan kering, kardus bekas dicacah, serbuk kayu) yang kaya karbon.
              </li>
              <li>
                <strong>Gunakan Container/Ember Berlubang:</strong> Manfaatkan wadah atau ember bekas yang diberi lubang-lubang kecil di bagian sisinya agar sirkulasi udara tetap lancar.
              </li>
              <li>
                <strong>Jaga Kelembapan Tumpukan:</strong> Pastikan isi kompos tidak terlalu basah dan tidak terlalu kering (terasa seperti spons lembap setelah diperas).
              </li>
              <li>
                <strong>Aduk Secara Berkala:</strong> Aduk kompos seminggu sekali untuk memastikan oksigen terdistribusi secara merata dan mempercepat kerja bakteri pengurai.
              </li>
            </ol>
          </div>

        </article>
      </main>
    </div>
  );
}