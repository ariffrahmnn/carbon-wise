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
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
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
