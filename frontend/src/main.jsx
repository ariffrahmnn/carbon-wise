import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './pages/LandingPage.jsx'
import About from './pages/about.jsx'
import References from './pages/references.jsx'

const pages = {
  '/about': About,
  '/references': References,
}

const Page = pages[window.location.pathname] ?? LandingPage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
