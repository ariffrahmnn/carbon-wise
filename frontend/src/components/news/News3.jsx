import React from 'react';
import '../../styles/news/article.css';

// Import gambar dari folder assets
import internetImg from '../../assets/internet.jpg';

export default function News3() {
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
            Jejak Karbon Digital: Apakah Aktivitas Internet Juga Menyumbang Emisi?
          </h2>

          <div className="article-meta">
            <span>Topik: <strong className="meta-topic">Jejak Karbon Digital & Infrastruktur IT</strong></span>
          </div>

          {/* GAMBAR DARI ASSETS */}
          <div className="article-image-wrapper">
            <img 
              src={internetImg} 
              alt="Infrastruktur Server Internet" 
              className="article-image"
            />
          </div>

          {/* KREDIT SUMBER DI BAWAH GAMBAR */}
          <p className="image-source-credit">
            Sumber Gambar :
            <a 
              href="https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w
            </a>
          </p>

          {/* PARAGRAF BACAAN */}
          <div className="article-body">
            <p className="article-paragraph">
              Di balik kemudahan akses situs web, aplikasi seluler, serta layanan <em>cloud</em> yang kita gunakan sehari-hari, terdapat infrastruktur penting yang bekerja tanpa henti. Komponen utama yang menopang seluruh lalu lintas data tersebut adalah Server.
            </p>

            <h3 className="article-subheading">Apa Itu Server?</h3>

            <p className="article-paragraph">
              Secara umum, server merupakan sistem komputer khusus yang dirancang untuk menyediakan data, layanan, serta sumber daya bagi komputer lain yang terhubung dalam suatu jaringan. Komputer penerima layanan ini biasa disebut sebagai <em>client</em>.
            </p>

            <p className="article-paragraph">
              Berbeda dengan perangkat komputer pribadi (<em>personal computer</em>) biasa, server didesain untuk beroperasi terus-menerus selama 24 jam sehari tanpa henti. Perangkat ini didukung oleh spesifikasi hardware yang tinggi, mulai dari kapasitas prosesor, memori RAM yang besar, hingga sistem penyimpanan data berskala tinggi.
            </p>

            <p className="article-paragraph">
              <strong>Prinsip Kerja:</strong> Konsep kerja server mengusung arsitektur <em>client-server</em>, di mana <em>client</em> mengirimkan permintaan (<em>request</em>) informasi, dan server memprosesnya untuk memberikan tanggapan (<em>response</em>) berupa data yang diminta secara cepat.
            </p>

            <h3 className="article-subheading">Fungsi Utama Server</h3>

            <p className="article-paragraph">
              Server memegang peranan krusial dalam jaringan komputer. Beberapa fungsi utamanya meliputi:
            </p>

            <ol className="article-list">
              <li>
                <strong>Menyimpan dan Mengelola Data:</strong> Server berfungsi sebagai pusat penyimpanan berkas, dokumen, dan basis data (<em>database</em>) yang dapat diakses bersama oleh pengguna yang terotorisasi.
              </li>
              <li>
                <strong>Melayani Permintaan Situs Web:</strong> Pada jenis <em>web server</em>, perangkat ini bertugas menyimpan dokumen HTML, CSS, JavaScript, dan media lain untuk ditampilkan pada browser pengguna saat mengunjungi alamat web tertentu.
              </li>
              <li>
                <strong>Mengatur Lalu Lintas Jaringan:</strong> Server dapat berfungsi membatasi, mengarahkan, serta mengamankan aliran data antarperangkat yang terhubung dalam satu jaringan lokal maupun internet.
              </li>
              <li>
                <strong>Menyediakan Layanan Aplikasi:</strong> Server aplikasi memungkinkan pengembang menjalankan program atau aplikasi yang dapat diakses serentak oleh banyak pengguna dari lokasi berbeda.
              </li>
            </ol>
          </div>

        </article>
      </main>
    </div>
  );
}