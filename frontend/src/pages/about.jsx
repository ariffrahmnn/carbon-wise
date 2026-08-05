import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import AboutContent from '../components/about/About.jsx'

function About() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </div>
  )
}

export default About
