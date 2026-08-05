import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom' // 1. Import useNavigate
import landingPageGif from '../assets/Vid.gif'
import { animateHeroEntrance } from '../animations/heroAnimation.js'

function Home() {
  const navigate = useNavigate() // 2. Inisialisasi hook navigate

  const eyebrowRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    animateHeroEntrance({
      eyebrowRef: eyebrowRef.current,
      line1Ref: line1Ref.current,
      line2Ref: line2Ref.current,
      subtitleRef: subtitleRef.current,
      buttonRef: buttonRef.current,
    })
  }, [])

  // 3. Handler untuk navigasi ke Login
  const handleStart = () => {
    navigate('/login')
  }

  return (
    <section className="hero page-container" id="home">
      <div className="hero__content">
        <div className="eyebrow" ref={eyebrowRef}>
          <span className="material-symbols-outlined" aria-hidden="true">eco</span>
          Enjoy nature &amp; safe earth
        </div>
        <h1>
          <span ref={line1Ref} style={{ display: 'inline-block' }}>
            Cintai Alam,
          </span>
          <br />
          <span ref={line2Ref} style={{ display: 'inline-block' }}>
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
          <img
            className="hero__video"
            src={landingPageGif}
            alt=""
          />
        </div>
      </div>
    </section>
  )
}

export default Home