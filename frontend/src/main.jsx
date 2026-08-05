import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global/index.css'

// Pages
import LandingPage from './pages/LandingPage.jsx'
import About from './pages/about.jsx'
import References from './pages/references.jsx'
import Travel from './components/Travel.jsx'

// Shared layout components
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Login from './components/auth/login/Login.jsx'
import Regis from './components/auth/register/Register.jsx'
import ResetPassword from './components/auth/login/ResetPassword.jsx'

// News Components
import News1 from './components/news/News1.jsx'
import News2 from './components/news/News2.jsx'
import News3 from './components/news/News3.jsx'
import News4 from './components/news/News4.jsx'
import News5 from './components/news/News5.jsx'
import News6 from './components/news/News6.jsx'

import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

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
        {/* Landing Page Utama */}
        <Route path="/" element={<LandingPage />} />

        {/* Halaman Auth (Login, Register & Reset Password) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regis />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/travel" element= {
            <ProtectedRoute>
              <Travel />
            </ProtectedRoute>
          } />

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