import { useEffect, useState } from 'react'
import '../styles/shared/header.css'
import appIcon from '../assets/Icon.png'

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
      </div>
    </header>
  )
}

export default Header
