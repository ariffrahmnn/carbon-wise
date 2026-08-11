import { useEffect, useState } from 'react'
import '../styles/shared/header.css'
const appIcon = '/Icon.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname + window.location.hash
      setCurrentPath(initialPath || '/')
    }

    // Auto-ScrollSpy menggunakan IntersectionObserver
    const sections = [
      { id: 'home', path: '/' },
      { id: 'edukasi', path: '/#edukasi' },
      { id: 'news', path: '/#news' }
    ]

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sections.find((s) => s.id === entry.target.id)
          if (match && window.location.pathname === '/') {
            setCurrentPath(match.path)
          }
        }
      })
    }, observerOptions)

    sections.forEach((sec) => {
      const element = document.getElementById(sec.id)
      if (element) observer.observe(element)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const handleNavClick = (path) => {
    setCurrentPath(path)
    closeMenu()
  }

  const isNotHome = typeof window !== 'undefined' && window.location.pathname !== '/';
  const isSolidHeader = isScrolled || isNotHome || currentPath.includes('/about');

  return (
    <header className={`site-header${isSolidHeader ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner page-container">
        <a className="brand" href="/" onClick={() => handleNavClick('/')}>
          <span className="brand__icon" aria-hidden="true">
            <img src={appIcon} alt="CarbonWise Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
          </span>
          <span className="brand__name">CarbonWiseCalc</span>
        </a>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav
            id="site-navigation"
            className={`site-navigation${isMenuOpen ? ' site-navigation--open' : ''}`}
            aria-label="Navigasi utama"
          >
            <a
              href="/"
              className={currentPath === '/' || currentPath === '' ? 'active' : ''}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              href="/#edukasi"
              className={currentPath.includes('#edukasi') ? 'active' : ''}
              onClick={() => handleNavClick('/#edukasi')}
            >
              Edukasi
            </a>
            <a
              href="/#news"
              className={currentPath.includes('news') ? 'active' : ''}
              onClick={() => handleNavClick('/#news')}
            >
              News
            </a>
            <a
              href="/about"
              className={currentPath.includes('/about') ? 'active' : ''}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
          </nav>

          <a
            href="/how-to-use"
            title="how to use"
            onClick={() => handleNavClick('/how-to-use')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isSolidHeader ? '#ffffff' : 'var(--color-primary, #4e0000)',
              transition: 'color 200ms ease',
              cursor: 'pointer'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" strokeDasharray="4 4"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
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
        </div>
      </div>
    </header>
  )
}

export default Header
