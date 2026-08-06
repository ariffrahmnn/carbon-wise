import { StrictMode, lazy, Suspense, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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

// Loading Spinner Halaman saat Lazy Chunk Diunduh
const PageLoader = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: '#ffffff',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: '4px solid #f1f5f9',
        borderTop: '4px solid #4a0e17',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: '#4a0e17', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
        Memuat Halaman CarbonWise...
      </span>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

// Komponen Indikator Spinner Loading Setiap Perpindahan Endpoint Route
const RouteTransitionLoader = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400); // 400ms transition spinner feedback
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isNavigating && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#4a0e17',
          padding: '10px 18px',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(74, 14, 23, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1.5px solid rgba(74, 14, 23, 0.15)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 700,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #4a0e17',
            animation: 'spin 0.7s linear infinite'
          }} />
          <span>Memuat Halaman...</span>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
      {children}
    </>
  );
};

// Wrapper untuk halaman yang menggunakan Header & Footer
const LayoutWrapper = ({ children }) => (
  <div className="app-shell">
    <Header />
    {children}
    <Footer />
  </div>
)

const AppRoutes = () => (
  <RouteTransitionLoader>
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
  </RouteTransitionLoader>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)