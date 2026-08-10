import '../styles/shared/footer.css'
import appIcon from '../assets/Icon.png'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer" style={{ paddingInline: '4vw' }}>
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a className="site-footer__logo" href="/" aria-label="CarbonWise home">
              <span className="site-footer__logo-icon" aria-hidden="true">
                <img src={appIcon} alt="CarbonWise Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              </span>
              <span className="site-footer__logo-text">CarbonWiseCalc</span>
            </a>
            <p className="site-footer__tagline">One step closer to a greener sky.</p>

            <div className="site-footer__socials" aria-label="Social media">
              <a href="https://www.instagram.com/carbonwisecalc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>

              <a href="mailto:carbonwisecalc@gmail.com" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          <nav className="site-footer__nav" aria-label="Company">
            <h2>Company</h2>
            <a href="/about">About Us</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Resources">
            <h2>Resources</h2>
            <a href="/#edukasi">Edukasi</a>
            <a href="/#news">News</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Legal">
            <h2>Legal</h2>
            <a href="/credits">Media Credits</a>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; 2026 CarbonWiseCalc- One step closer to a greener sky.</p>
          <button type="button" onClick={scrollToTop}>
            <span>Back to Top</span>
            <span className="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
