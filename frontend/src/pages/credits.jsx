import Header from '../components/header.jsx'
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
      creator: "Kreator Pexels", 
      link: "#",
      isButton: true
    }
  ];

  const newsImages = [
    { src: kemacetanImg, title: "Kemacetan & Emisi", creator: "Nama Kreator", link: "#" },
    { src: kapalImg, title: "Emisi Kapal", creator: "Nama Kreator", link: "#" },
    { src: internetImg, title: "Jejak Digital", creator: "Nama Kreator", link: "#" },
    { src: sampahImg, title: "Masalah Sampah", creator: "Nama Kreator", link: "#" },
    { src: mobilListrikImg, title: "Mobil Listrik", creator: "Nama Kreator", link: "#" },
    { src: asalKarbonImg, title: "Asal Karbon", creator: "Nama Kreator", link: "#" }
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
                <span className="material-symbols-outlined" aria-hidden="true">photo_camera</span>
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
                <span className="material-symbols-outlined" aria-hidden="true">videocam</span>
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
    </div>
  )
}

export default Credits
