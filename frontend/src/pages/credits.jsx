import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import '../styles/global/credits.css'

import kemacetanImg from '../assets/kemacetan.jpg'
import kapalImg from '../assets/kapal.jpg'
import internetImg from '../assets/internet.jpg'
import sampahImg from '../assets/sampah.jpg'
import mobilListrikImg from '../assets/mobillistrik.jpg'
import asalKarbonImg from '../assets/asalkarbon.jpg'
import loginRegisterImg from '../assets/LoginRegister.jpg'

// Menggunakan gambar yang baru diupload
import homeVid1Img from '../assets/Footage1.png'
import homeVid2Img from '../assets/Footage2.png'
import homeVid3Img from '../assets/Footage3.png'

import unsplashIcon from '../assets/unsplash.png'
import pexelsIcon from '../assets/pexels.png'

function Credits() {
  const authImages = [
    { 
      src: loginRegisterImg, 
      title: "Latar Belakang Login & Register", 
      creator: "John Towner", 
      link: "https://unsplash.com/id/foto/jalan-beton-kosong-yang-ditutupi-oleh-pokok-pokok-tinggi-dengan-sinar-matahari-3Kv48NS4WUU",
      isButton: true
    },
    { 
      src: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop", 
      title: "Gambar Card Login & Register", 
      creator: "Nama Kreator", 
      link: "#"
    }
  ];

  const homeVideoImages = [
    { 
      src: homeVid1Img, 
      title: "Video Hutan Berkabut", 
      creator: "Yasin Onuş", 
      link: "https://www.pexels.com/video/sunlight-filtering-through-misty-forest-trees-35821946/",
      isButton: true
    },
    { 
      src: homeVid2Img, 
      title: "Video Pohon Rindang", 
      creator: "Matthias Groeneveld", 
      link: "https://www.pexels.com/video/forest-under-sunlight-12366844/",
      isButton: true
    },
    { 
      src: homeVid3Img, 
      title: "Video Hutan Matahari", 
      creator: "Matthias Groeneveld", 
      link: "https://www.pexels.com/id-id/video/kayu-cahaya-sinar-jalan-27065375/",
      isButton: true
    }
  ];

  const newsImages = [
    { src: kemacetanImg, title: "Kemacetan & Emisi", creator: "Jonas Degener", link: "https://unsplash.com/id/foto/jalan-raya-yang-penuh-lalu-lintas-melintasi-sebuah-kota-pada-jam-emas-72CrKMqbwkM", isButton: true },
    { src: kapalImg, title: "Emisi Kapal", creator: "Venti Views", link: "https://unsplash.com/id/foto/pemandangan-udara-perahu-biru-dan-putih-di-badan-air-di-siang-hari-FPKnAO-CF6M", isButton: true },
    { src: internetImg, title: "Jejak Digital", creator: "Scott Rodgerson", link: "https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w", isButton: true },
    { src: sampahImg, title: "Masalah Sampah", creator: "Antoine Giret", link: "https://unsplash.com/photos/garbage-near-forest-7_TSzqJms4w", isButton: true },
    { src: mobilListrikImg, title: "Mobil Listrik", creator: "Iyan Ryan", link: "https://unsplash.com/photos/a-man-working-on-a-car-engine-in-a-garage-nkdv9cqz9VE", isButton: true },
    { src: asalKarbonImg, title: "Asal Karbon", creator: "Alex Simpson", link: "https://unsplash.com/photos/gray-and-red-factory-building-under-a-calm-blue-sky-9GwMIek9jnY", isButton: true }
  ];

  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="credits page-container" aria-labelledby="credits-title">
          <div className="credits__header">
            <p className="section-heading__eyebrow">Apresiasi & Atribusi</p>
            <h1 id="credits-title">Kredit Media</h1>
            <p>Terima kasih kepada para kreator luar biasa di Unsplash dan Pexels yang telah menyediakan aset visual (foto dan video) berkualitas tinggi untuk CarbonWise.</p>
          </div>
          
          <div className="credits__content">
            <div className="credits__platform">
              <div className="credits__platform-header">
                <h2>Unsplash</h2>
                <img src={unsplashIcon} alt="Unsplash" className="credits__platform-icon credits__platform-icon--outlined" />
              </div>
              <p>Foto-foto indah dengan lisensi terbuka yang menghidupkan pengalaman pengguna di CarbonWise.</p>
              <ul>
                <li>Semua foto alam dan lingkungan diambil dari komunitas fotografer berbakat di Unsplash.</li>
                {/* Anda dapat menambahkan link spesifik ke kreator di bawah ini nantinya */}
                {/* <li>Foto oleh <a href="#" target="_blank" rel="noopener noreferrer">Nama Fotografer</a></li> */}
              </ul>
            </div>
            
            <div className="credits__platform">
              <div className="credits__platform-header">
                <h2>Pexels</h2>
                <img src={pexelsIcon} alt="Pexels" className="credits__platform-icon" />
              </div>
              <p>Video dan gambar stok gratis yang dibagikan oleh kreator berbakat di seluruh dunia.</p>
              <ul>
                <li>Berbagai aset video ilustrasi tentang karbon dan pergerakan alam disediakan oleh kreator Pexels.</li>
                {/* Anda dapat menambahkan link spesifik ke kreator di bawah ini nantinya */}
                {/* <li>Video oleh <a href="#" target="_blank" rel="noopener noreferrer">Nama Kreator</a></li> */}
              </ul>
            </div>
          </div>

          <div className="credits__gallery-section">
            <h2 className="credits__gallery-title">Aset Video Home Page</h2>
            <div className="credits__gallery">
              {homeVideoImages.map((img, index) => (
                <div key={index} className="credits__gallery-card">
                  <div className="credits__gallery-image">
                    <img src={img.src} alt={img.title} loading="lazy" />
                  </div>
                  <div className="credits__gallery-info">
                    <h3>{img.title}</h3>
                    {img.isButton ? (
                      <a href={img.link} target="_blank" rel="noopener noreferrer" className="credits__gallery-btn">
                        Video oleh {img.creator}
                      </a>
                    ) : (
                      <p>Video oleh <a href={img.link} target="_blank" rel="noopener noreferrer">{img.creator}</a></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="credits__gallery-section">
            <h2 className="credits__gallery-title">Aset Gambar Login & Register</h2>
            <div className="credits__gallery">
              {authImages.map((img, index) => (
                <div key={index} className="credits__gallery-card">
                  <div className="credits__gallery-image">
                    <img src={img.src} alt={img.title} loading="lazy" />
                  </div>
                  <div className="credits__gallery-info">
                    <h3>{img.title}</h3>
                    {img.isButton ? (
                      <a href={img.link} target="_blank" rel="noopener noreferrer" className="credits__gallery-btn">
                        Foto oleh {img.creator}
                      </a>
                    ) : (
                      <p>Foto oleh <a href={img.link} target="_blank" rel="noopener noreferrer">{img.creator}</a></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="credits__gallery-section">
            <h2 className="credits__gallery-title">Aset Gambar Berita (News)</h2>
            <div className="credits__gallery">
              {newsImages.map((img, index) => (
                <div key={index} className="credits__gallery-card">
                  <div className="credits__gallery-image">
                    <img src={img.src} alt={img.title} loading="lazy" />
                  </div>
                  <div className="credits__gallery-info">
                    <h3>{img.title}</h3>
                    {img.isButton ? (
                      <a href={img.link} target="_blank" rel="noopener noreferrer" className="credits__gallery-btn">
                        Foto oleh {img.creator}
                      </a>
                    ) : (
                      <p>Foto oleh <a href={img.link} target="_blank" rel="noopener noreferrer">{img.creator}</a></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Credits
