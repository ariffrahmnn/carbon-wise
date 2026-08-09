import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import landingPageVideo from '../../assets/Vid.mp4'
import { animateHeroEntrance } from '../../animations/heroAnimation.js'

function Home() {
  const navigate = useNavigate() // 2. Inisialisasi hook navigate

  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    animateHeroEntrance({
      line1Ref: line1Ref.current,
      line2Ref: line2Ref.current,
      subtitleRef: subtitleRef.current,
      buttonRef: buttonRef.current,
    })
  }, [])

  // 3. Handler untuk navigasi (apabila sudah login langsung masuk ke dashboard /input)
  const handleStart = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/input');
    } else {
      navigate('/login');
    }
  }

  return (
    <section className="hero page-container" id="home">
      <div className="hero__content">
        <h1>
          <span ref={line1Ref} style={{ display: 'inline-block' }}>
            Cintai Alam,
          </span>
          <br />
          <span ref={line2Ref} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            Kurangi Jejak.
          </span>
        </h1>
        <p ref={subtitleRef}>
          Setiap langkah kecil berarti. Pantau dan kurangi emisi karbon harian Anda dengan cara yang lebih menyenangkan.
        </p>

        {/* 4. Mengubah <a> menjadi <button> dengan onClick */}
        <button 
          className="primary-button" 
          onClick={handleStart} 
          ref={buttonRef}
          type="button"
        >
          Mulai sekarang
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </button>
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