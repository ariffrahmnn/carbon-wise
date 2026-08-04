import { useEffect, useRef } from 'react'
import landingPageVideo from '../assets/LandingPage.mp4'
import { animateHeroEntrance } from '../animations/heroAnimation.js'

function Home() {
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

  return (
    <section className="hero page-container" id="home">
      <div className="hero__content">
        <div className="eyebrow" ref={eyebrowRef}>
          <span className="material-symbols-outlined" aria-hidden="true">eco</span>
          Enjoy nature &amp; safe earth
        </div>
        <h1>
          <span ref={line1Ref} style={{ display: 'inline-block', color: 'var(--color-primary)' }}>
            Cintai Alam,
          </span>
          <br />
          <span ref={line2Ref} style={{ display: 'inline-block', color: 'var(--color-accent)' }}>
            Kurangi Jejak.
          </span>
        </h1>
        <p ref={subtitleRef}>
          Setiap langkah kecil berarti. Pantau dan kurangi emisi karbon harian Anda dengan cara yang lebih menyenangkan.
        </p>
        <a className="primary-button" href="#edukasi" ref={buttonRef}>
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
