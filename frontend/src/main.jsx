import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global/index.css'

// Page Dasar (Loaded Eagerly)
import LandingPage from './pages/LandingPage.jsx'

// Lazy Loading Halaman Berat untuk Optimasi Performa & Ukuran Bundle
const About = lazy(() => import('./pages/about.jsx'))
const References = lazy(() => import('./pages/references.jsx'))
const Travel = lazy(() => import('./components/Travel.jsx'))
const FoodInput = lazy(() => import('./components/FoodInput.jsx'))
const Analytics = lazy(() => import('./pages/Analytics.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

// Auth Components
const Login = lazy(() => import('./components/auth/login/Login.jsx'))
const Regis = lazy(() => import('./components/auth/register/Register.jsx'))
const ResetPassword = lazy(() => import('./components/auth/login/ResetPassword.jsx'))

// Shared Layout Components
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'

// News Components (Lazy Loaded)
const News1 = lazy(() => import('./components/news/News1.jsx'))
const News2 = lazy(() => import('./components/news/News2.jsx'))
const News3 = lazy(() => import('./components/news/News3.jsx'))
const News4 = lazy(() => import('./components/news/News4.jsx'))
const News5 = lazy(() => import('./components/news/News5.jsx'))
const News6 = lazy(() => import('./components/news/News6.jsx'))

import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AdminRoute from './components/auth/AdminRoute.jsx'

// Loading Indicator Sederhana
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Inter, sans-serif',
    color: '#4A0E17',
    fontWeight: 600
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #4A0E17',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 12px'
      }} />
      <span>Memuat Halaman CarbonWise...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
)

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Page Utama */}
          <Route path="/" element={<LandingPage />} />

          {/* Halaman Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Regis />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Halaman Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          <Route path="/travel" element={<ProtectedRoute><Travel /></ProtectedRoute>} />
          <Route path="/input" element={<ProtectedRoute><FoodInput /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          {/* Halaman Standar */}
          <Route path="/about" element={<About />} />
          <Route path="/references" element={<References />} />

          {/* Halaman News */}
          <Route path="/news1" element={<LayoutWrapper><News1 /></LayoutWrapper>} />
          <Route path="/news2" element={<LayoutWrapper><News2 /></LayoutWrapper>} />
          <Route path="/news3" element={<LayoutWrapper><News3 /></LayoutWrapper>} />
          <Route path="/news4" element={<LayoutWrapper><News4 /></LayoutWrapper>} />
          <Route path="/news5" element={<LayoutWrapper><News5 /></LayoutWrapper>} />
          <Route path="/news6" element={<LayoutWrapper><News6 /></LayoutWrapper>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
)