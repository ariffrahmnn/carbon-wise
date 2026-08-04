import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Pages
import LandingPage from './pages/LandingPage.jsx'
import About from './pages/about.jsx'
import References from './pages/references.jsx'

// Components (Selevel di folder components)
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Login from './components/login.jsx'
import Regis from './components/regis.jsx'

// News Components
import News1 from './components/news1.jsx'
import News2 from './components/news2.jsx'
import News3 from './components/news3.jsx'
import News4 from './components/news4.jsx'
import News5 from './components/news5.jsx'
import News6 from './components/news6.jsx'

// Wrapper untuk halaman yang menggunakan Header & Footer
const LayoutWrapper = ({ children }) => (
  <div className="app-shell">
    <Header />
    {children}
    <Footer />
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing Page Utamama */}
        <Route path="/" element={<LandingPage />} />

        {/* Halaman Auth (Login & Register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regis />} />

        {/* Halaman Standar */}
        <Route path="/about" element={<About />} />
        <Route path="/references" element={<References />} />

        {/* Halaman News (Ber-Layout Header + Footer) */}
        <Route path="/news1" element={<LayoutWrapper><News1 /></LayoutWrapper>} />
        <Route path="/news2" element={<LayoutWrapper><News2 /></LayoutWrapper>} />
        <Route path="/news3" element={<LayoutWrapper><News3 /></LayoutWrapper>} />
        <Route path="/news4" element={<LayoutWrapper><News4 /></LayoutWrapper>} />
        <Route path="/news5" element={<LayoutWrapper><News5 /></LayoutWrapper>} />
        <Route path="/news6" element={<LayoutWrapper><News6 /></LayoutWrapper>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)