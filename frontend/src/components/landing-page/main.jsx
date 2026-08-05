import Home from './home.jsx'
import Edukasi from './edukasi.jsx'
import News from './News.jsx'
import '../../styles/landing-page/landing.css'
import '../../styles/landing-page/news-section.css'

Main() {
  return (
    <main>
      <Home />
      <Edukasi />
      <News />
    </main>
  )
}

export default Main