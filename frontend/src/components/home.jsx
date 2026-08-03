import landingPageVideo from '../assets/LandingPage.mp4'

function Home() {
  return (
    <section className="hero page-container" id="beranda">
      <div className="hero__content">
        <div className="eyebrow">
          <span className="material-symbols-outlined" aria-hidden="true">eco</span>
          Enjoy nature &amp; safe earth
        </div>
        <h1>Cintai Alam,<br /><span>Kurangi Jejak.</span></h1>
        <p>Setiap langkah kecil berarti. Pantau dan kurangi emisi karbon harian Anda dengan cara yang lebih menyenangkan.</p>
        <a className="primary-button" href="#edukasi">
          Mulai sekarang
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </a>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__video-wrap">
          <video
            className="hero__video"
            src={landingPageVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  )
}

export default Home
