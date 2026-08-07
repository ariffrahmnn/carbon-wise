import '../styles/shared/footer.css'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a className="site-footer__logo" href="/" aria-label="CarbonWise home">
              <span className="site-footer__logo-icon" aria-hidden="true">
                <span className="material-symbols-outlined">eco</span>
              </span>
              <span className="site-footer__logo-text">CarbonWise</span>
            </a>
            <p className="site-footer__tagline">One step closer to a greener sky.</p>

            <div className="site-footer__socials" aria-label="Social media">
              <a href="#" aria-label="Instagram">
                <span className="material-symbols-outlined" aria-hidden="true">photo_camera</span>
              </a>
              <a href="#" aria-label="Twitter">
                <span className="material-symbols-outlined" aria-hidden="true">flutter_dash</span>
              </a>
              <a href="#" aria-label="LinkedIn">
                <span className="material-symbols-outlined" aria-hidden="true">work</span>
              </a>
            </div>
          </div>

          <nav className="site-footer__nav" aria-label="Company">
            <h2>Company</h2>
            <a href="/about">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Resources">
            <h2>Resources</h2>
            <a href="/#edukasi">Edukasi</a>
            <a href="/#news">News</a>
            <a href="#">FAQ</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Legal">
            <h2>Legal</h2>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; 2026 CarbonWise - One step closer to a greener sky.</p>
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
