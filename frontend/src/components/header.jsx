import { useEffect, useState } from 'react'
import '../styles/header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner page-container">
          <a className="brand" href="/" onClick={closeMenu}>
          <span className="brand__icon" aria-hidden="true">
            <span className="material-symbols-outlined">eco</span>
          </span>
          <span className="brand__name">CarbonWise</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <nav
          id="site-navigation"
          className={`site-navigation${isMenuOpen ? ' site-navigation--open' : ''}`}
          aria-label="Navigasi utama"
        >
          <a href="/" onClick={closeMenu}>Home</a>
          <a href="/#edukasi" onClick={closeMenu}>Edukasi</a>
          <a href="/#news" onClick={closeMenu}>News</a>
          <a href="/about" onClick={closeMenu}>About</a>
          <a href="/references" onClick={closeMenu}>Referensi</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
