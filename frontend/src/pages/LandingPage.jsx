import { useEffect } from 'react'
import Header from '../components/header.jsx'
import Main from '../components/landing-page/main.jsx'
import Footer from '../components/footer.jsx'

function LandingPage() {
  useEffect(() => {
    if (!window.location.hash) return

    const sectionId = window.location.hash.slice(1)
    const section = document.getElementById(sectionId)

    section?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="app-shell">
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

export default LandingPage
