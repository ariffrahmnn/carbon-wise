import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Plus, Trash2, PenTool, Navigation, BarChart3, LogOut, CheckCircle, AlertCircle, X } from 'lucide-react';
import appIcon from '../assets/Icon.png';
import tofuImg from '../assets/tofu.jpg';
import tempehImg from '../assets/tempeh.jpg';
import beefImg from '../assets/beef.jpg';
import chickenImg from '../assets/chicken.jpg';
import fishImg from '../assets/fish.jpg';
import eggImg from '../assets/egg.jpg';
import riceImg from '../assets/rice.jpg';
import vegetableImg from '../assets/vegetable.jpg';

import '../styles/headerkalkulator.css';
import '../styles/shared/footer.css';
import '../styles/travel.css';
import '../styles/analytics.css';
import SaveStatusOverlay from './common/SaveStatusOverlay.jsx';
import ScrollHint from './common/ScrollHint.jsx';

// Fallback Data Master Makanan per 1 Gram
const DEFAULT_FOOD_ITEMS = [
  { id: 13, item_name: 'Daging', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.027000, emission_factor: 0.027000 },
  { id: 14, item_name: 'Ayam', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.006000, emission_factor: 0.006000 },
  { id: 15, item_name: 'Ikan', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.005000, emission_factor: 0.005000 },
  { id: 16, item_name: 'Telur', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.004800, emission_factor: 0.004800 },
  { id: 17, item_name: 'Nasi', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.004000, emission_factor: 0.004000 },
  { id: 18, item_name: 'Tahu', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.001000, emission_factor: 0.001000 },
  { id: 19, item_name: 'Tempe', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.001000, emission_factor: 0.001000 },
  { id: 20, item_name: 'Sayur', category_id: 1, unit: 'gram', co2_factor_per_unit: 0.000400, emission_factor: 0.000400 }
];

const FoodInput = () => {
  const navigate = useNavigate();
  const [masterItems, setMasterItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [weightGrams, setWeightGrams] = useState('');
  const [foodLogs, setFoodLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State Toast Alert & User & Save Status
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'success'

  // Refs untuk pembersihan timer agar tidak memory leak saat unmount
  const toastTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Gagal membaca data user dari localStorage:', err);
      }
    }

    // Cleanup timer saat komponen unmount
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const userName = user?.fullName || user?.name || user?.username || 'User';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const showNotification = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  }, []);

  // Fetch Master Data Makanan Dinamis dari API Backend
  useEffect(() => {
    let isMounted = true;

    const fetchMasterItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/emissions/master-items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (isMounted) {
          if (response.ok && result.success) {  
            const foodItems = result.data.filter(
              (item) => item.category_id === 1 || item.unit === 'gram' || (item.category_type && item.category_type.toUpperCase() === 'FOOD')
            );

            if (foodItems.length > 0) {
              setMasterItems(foodItems);
            } else {
              setMasterItems(DEFAULT_FOOD_ITEMS);
            }
          } else {
            setMasterItems(DEFAULT_FOOD_ITEMS);
          }
        }
      } catch (error) {
        console.error('Gagal mengambil master data makanan:', error);
        if (isMounted) setMasterItems(DEFAULT_FOOD_ITEMS);
      }
    };

    fetchMasterItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderFoodIcon = useCallback((itemName) => {
    const name = itemName.toLowerCase();
    let imgSrc = null;

    if (name.includes('daging')) imgSrc = beefImg;
    else if (name.includes('ayam')) imgSrc = chickenImg;
    else if (name.includes('ikan')) imgSrc = fishImg;
    else if (name.includes('telur')) imgSrc = eggImg;
    else if (name.includes('nasi')) imgSrc = riceImg;
    else if (name.includes('tahu')) imgSrc = tofuImg;
    else if (name.includes('tempe')) imgSrc = tempehImg;
    else if (name.includes('sayur')) imgSrc = vegetableImg;

    if (imgSrc) {
      return (
        <img 
          src={imgSrc} 
          alt={itemName} 
          style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '10px', 
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }} 
        />
      );
    }

    return <Utensils size={28} className="vehicle-icon" />;
  }, []);

  const handleAddLog = useCallback(() => {
    if (!selectedFood) {
      showNotification('Pilih jenis makanan terlebih dahulu!', 'error');
      return;
    }
    if (!weightGrams || parseFloat(weightGrams) <= 0) {
      showNotification('Masukkan berat makanan (gram) yang valid!', 'error');
      return;
    }

    const factor = selectedFood.co2_factor_per_unit || selectedFood.emission_factor;

    const newLog = {
      temp_id: Date.now(),
      item_id: selectedFood.id,
      item_name: selectedFood.item_name,
      quantity_value: parseFloat(weightGrams),
      emission_factor: parseFloat(factor),
      unit: selectedFood.unit || 'gram'
    };

    setFoodLogs((prevLogs) => [...prevLogs, newLog]);
    showNotification(`${selectedFood.item_name} (${weightGrams} gram) ditambahkan!`, 'success');
    
    setSelectedFood(null);
    setWeightGrams('');
  }, [selectedFood, weightGrams, showNotification]);

  const handleRemoveLog = useCallback((tempId, name) => {
    setFoodLogs((prevLogs) => prevLogs.filter((item) => item.temp_id !== tempId));
    showNotification(`Item ${name} dihapus dari daftar`, 'error');
  }, [showNotification]);

  // Rumus Emisi Makanan (Memoized)
  const totalEstimate = useMemo(() => {
    return foodLogs.reduce((total, item) => total + (item.quantity_value * item.emission_factor), 0);
  }, [foodLogs]);

  const handleSaveData = async () => {
    if (foodLogs.length === 0) {
      showNotification('Belum ada data konsumsi makanan untuk disimpan!', 'error');
      return;
    }

    setIsLoading(true);
    setSaveStatus('saving');

    try {
      const payload = {
        items: foodLogs.map((log) => ({
          item_id: log.item_id,
          quantity_value: log.quantity_value
        }))
      };

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/api/v1/emissions/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setSaveStatus('success');
        setFoodLogs([]);

        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = setTimeout(() => {
          setSaveStatus(null);
          navigate('/analytics');
        }, 1400);
      } else {
        setSaveStatus(null);
        showNotification(result.message || 'Gagal menyimpan data ke server!', 'error');
      }
    } catch (error) {
      console.error('Error submitting food emission:', error);
      setSaveStatus(null);
      showNotification('Terjadi kesalahan jaringan atau server mati!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layout-wrapper">
      {/* Toast Alert */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
          <button 
            type="button" 
            className="toast-close" 
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="calc-header">
        <div className="calc-header-left">
          <div className="calc-brand">
            <div className="calc-logo-icon">
              <img src={appIcon} alt="CarbonWise Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            </div>
            <span className="calc-brand-title">CarbonWise</span>
          </div>
        </div>

        <div className="calc-header-right">
          <div className="calc-user-profile">
            <div className="calc-avatar">{userInitial}</div>
            <span className="calc-user-name">{userName}</span>
          </div>

          <button 
            className="calc-btn-logout" 
            title="Keluar" 
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="main-body">
        {/* SIDEBAR SECTION */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/input" className="nav-item active">
              <PenTool size={22} />
              <span>Makanan</span>
            </Link>
            <Link to="/travel" className="nav-item">
              <Navigation size={22} />
              <span>Travel</span>
            </Link>
            <Link to="/analytics" className="nav-item">
              <BarChart3 size={22} />
              <span>Grafik</span>
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="content-area">
          <button
            type="button"
            className="auth-back-home-btn analytics-back-home-btn"
            onClick={() => navigate('/')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Beranda
          </button>

          <div className="travel-container">
            <h3 className="section-title">Pilih Jenis Makanan</h3>

            {/* Grid Pilihan Makanan Dinamis */}
            <div className="vehicle-grid">
              {masterItems.length === 0 ? (
                <p>Memuat opsi makanan...</p>
              ) : (
                masterItems.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className={`vehicle-card ${selectedFood?.id === food.id ? 'selected' : ''}`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <div className="vehicle-icon-wrapper">
                      {renderFoodIcon(food.item_name)}
                    </div>
                    <span className="vehicle-label">{food.item_name}</span>
                  </button>
                ))
              )}
            </div>

            {/* Tombol Template Porsi Cepat */}
            {selectedFood && (
              <div className="quick-select-group">
                <span className="quick-select-label">Porsi cepat:</span>
                <div className="quick-select-buttons">
                  {[100, 300, 500].map((gram) => (
                    <button
                      key={gram}
                      type="button"
                      className="quick-select-btn"
                      onClick={() => setWeightGrams(prev => String((parseInt(prev) || 0) + gram))}
                    >
                      +{gram} gram
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Input Berat (Gram) */}
            {selectedFood && (
              <div className="distance-input-card">
                <p className="selected-info">
                  Makanan Terpilih: <strong>{selectedFood.item_name}</strong>
                </p>
                <div className="input-inline">
                  <input
                    type="number"
                    className="distance-field"
                    placeholder={`Masukkan berat (${selectedFood.unit || 'gram'})`}
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    min="1"
                    step="any"
                  />
                  <button 
                    type="button" 
                    className="btn-add" 
                    onClick={handleAddLog}
                  >
                    <Plus size={18} />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            )}

            {/* List Makanan Terpilih */}
            <div className="logs-wrapper">
              <h4 className="section-subtitle">Daftar Makanan Terpilih</h4>
              {foodLogs.length === 0 ? (
                <p className="empty-logs">Belum ada aktivitas konsumsi makanan yang ditambahkan.</p>
              ) : (
                foodLogs.map((log) => (
                  <div key={log.temp_id} className="log-card">
                    <span className="log-detail">
                      <strong>{log.item_name}</strong> - {log.quantity_value} {log.unit}
                    </span>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleRemoveLog(log.temp_id, log.item_name)}
                      title="Hapus item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Estimasi Ringkasan Emisi Makanan */}
            <div className="travel-estimate-card">
              <span>Estimasi Emisi Makanan:</span>
              <strong>{totalEstimate.toFixed(2)} kg CO₂</strong>
            </div>

            {/* Tombol Simpan */}
            <button 
              type="button" 
              className="btn-submit-all" 
              onClick={handleSaveData}
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </main>
      </div>


      {/* OVERLAY ANIMASI MENYIMPAN & SUKSES */}
      <SaveStatusOverlay status={saveStatus} message={saveStatus === 'saving' ? 'Menyimpan Emisi Makanan...' : 'Berhasil Menyimpan Progress!'} />
    </div>
  );
};

export default FoodInput;
