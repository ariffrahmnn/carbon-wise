import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './pages/LandingPage.jsx'
import About from './pages/about.jsx'
import References from './pages/references.jsx'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'

import News1 from './components/news1.jsx'
import News2 from './components/news2.jsx'
import News3 from './components/news3.jsx'
import News4 from './components/news4.jsx'
import News5 from './components/news5.jsx'
import News6 from './components/news6.jsx'

const renderWithLayout = (Component) => (
  <div className="app-shell">
    <Header />
    <Component />
    <Footer />
  </div>
)

const pages = {
  '/about': About,
  '/references': References,
  '/news1': () => renderWithLayout(News1),
  '/news2': () => renderWithLayout(News2),
  '/news3': () => renderWithLayout(News3),
  '/news4': () => renderWithLayout(News4),
  '/news5': () => renderWithLayout(News5),
  '/news6': () => renderWithLayout(News6),
}

const targetPath = window.location.pathname
const PageComponent = pages[targetPath]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PageComponent ? <PageComponent /> : <LandingPage />}
  </StrictMode>,
)
