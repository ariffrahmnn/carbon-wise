import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Bike, Bus, Footprints, Trash2, Plus, PenTool, Navigation, BarChart3, LogOut, Leaf, CheckCircle, AlertCircle, X } from 'lucide-react';

import busImg from '../assets/bus.jpg';
import walkImg from '../assets/walk.jpg';
import carImg from '../assets/car.jpg';
import motorbikeImg from '../assets/motorbike.jpg';

import '../styles/headerkalkulator.css';
import '../styles/shared/footer.css';
import '../styles/travel.css';
import '../styles/analytics.css';
import SaveStatusOverlay from './common/SaveStatusOverlay.jsx';
import ScrollHint from './common/ScrollHint.jsx';

const DEFAULT_TRAVEL_ITEMS = [
  { id: 21, item_name: 'Mobil', category_type: 'TRAVEL', emission_factor: 0.190000, unit: 'km' },
  { id: 22, item_name: 'Motor', category_type: 'TRAVEL', emission_factor: 0.100000, unit: 'km' },
  { id: 23, item_name: 'Bus', category_type: 'TRAVEL', emission_factor: 1.200000, unit: 'km' },
  { id: 24, item_name: 'Jalan', category_type: 'TRAVEL', emission_factor: 0.000000, unit: 'km' }
];

const Travel = () => {
  const navigate = useNavigate();
  const [masterItems, setMasterItems] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [distance, setDistance] = useState('');
  const [travelLogs, setTravelLogs] = useState([]);
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

    // Cleanup timer saat unmount
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
            const travelItems = result.data.filter(
              (item) => item.category_type && item.category_type.toUpperCase() === 'TRAVEL'
            );
            if (travelItems.length > 0) {
              setMasterItems(travelItems);
            } else {
              setMasterItems(DEFAULT_TRAVEL_ITEMS);
            }
          } else {
            setMasterItems(DEFAULT_TRAVEL_ITEMS);
          }
        }
      } catch (error) {
        console.error('Gagal mengambil master data travel:', error);
        if (isMounted) setMasterItems(DEFAULT_TRAVEL_ITEMS);
      }
    };

    fetchMasterItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderVehicleIcon = useCallback((itemName) => {
    const name = itemName.toLowerCase();
    let imgSrc = null;

    if (name.includes('bus')) imgSrc = busImg;
    else if (name.includes('jalan')) imgSrc = walkImg;
    else if (name.includes('mobil')) imgSrc = carImg;
    else if (name.includes('motor')) imgSrc = motorbikeImg;

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

    return <Car size={28} className="vehicle-icon" />;
  }, []);

  const handleAddLog = useCallback(() => {
    if (!selectedVehicle) {
      showNotification('Pilih jenis kendaraan terlebih dahulu!', 'error');
      return;
    }
    if (!distance || parseFloat(distance) <= 0) {
      showNotification('Masukkan jarak perjalanan yang valid!', 'error');
      return;
    }

    const newLog = {
      temp_id: Date.now(),
      item_id: selectedVehicle.id,
      item_name: selectedVehicle.item_name,
      quantity_value: parseFloat(distance),
      emission_factor: parseFloat(selectedVehicle.emission_factor),
      unit: selectedVehicle.unit
    };

    setTravelLogs((prevLogs) => [...prevLogs, newLog]);
    showNotification(`${selectedVehicle.item_name} (${distance} ${selectedVehicle.unit}) ditambahkan!`, 'success');
    
    setSelectedVehicle(null);
    setDistance('');
  }, [selectedVehicle, distance, showNotification]);

  const handleRemoveLog = useCallback((tempId, name) => {
    setTravelLogs((prevLogs) => prevLogs.filter((item) => item.temp_id !== tempId));
    showNotification(`Item ${name} dihapus dari daftar`, 'error');
  }, [showNotification]);

  // Total emisi travel (Memoized)
  const totalEstimate = useMemo(() => {
    return travelLogs.reduce((total, item) => total + (item.quantity_value * item.emission_factor), 0);
  }, [travelLogs]);

  const handleSaveData = async () => {
    if (travelLogs.length === 0) {
      showNotification('Belum ada data perjalanan untuk disimpan!', 'error');
      return;
    }

    setIsLoading(true);
    setSaveStatus('saving');

    try {
      const payload = {
        items: travelLogs.map((log) => ({
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
        setTravelLogs([]);

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
      console.error('Error submitting travel emission:', error);
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
              <Leaf size={20} />
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
            <Link to="/input" className="nav-item">
              <PenTool size={22} />
              <span>Makanan</span>
            </Link>
            <Link to="/travel" className="nav-item active">
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
            <h3 className="section-title">Pilih Jenis Kendaraan</h3>

            {/* Grid Pilihan Kendaraan dari Backend */}
            <div className="vehicle-grid">
              {masterItems.length === 0 ? (
                <p>Memuat opsi kendaraan...</p>
              ) : (
                masterItems.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="vehicle-icon-wrapper">
                      {renderVehicleIcon(vehicle.item_name)}
                    </div>
                    <span className="vehicle-label">{vehicle.item_name}</span>
                  </button>
                ))
              )}
            </div>

            {/* Tombol Template Jarak Cepat */}
            {selectedVehicle && (
              <div className="quick-select-group">
                <span className="quick-select-label">Jarak cepat:</span>
                <div className="quick-select-buttons">
                  {[1, 3, 5].map((km) => (
                    <button
                      key={km}
                      type="button"
                      className={`quick-select-btn ${distance === String(km) ? 'active' : ''}`}
                      onClick={() => setDistance(String(km))}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Input Jarak */}
            {selectedVehicle && (
              <div className="distance-input-card">
                <p className="selected-info">
                  Kendaraan Terpilih: <strong>{selectedVehicle.item_name}</strong>
                </p>
                <div className="input-inline">
                  <input
                    type="number"
                    className="distance-field"
                    placeholder={`Masukkan jarak (${selectedVehicle.unit})`}
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    min="0.1"
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

            {/* List Perjalanan */}
            <div className="logs-wrapper">
              <h4 className="section-subtitle">Daftar Perjalanan Terpilih</h4>
              {travelLogs.length === 0 ? (
                <p className="empty-logs">Belum ada aktivitas perjalanan yang ditambahkan.</p>
              ) : (
                travelLogs.map((log) => (
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

            {/* Estimasi Ringkasan Emisi */}
            <div className="travel-estimate-card">
              <span>Estimasi Emisi Perjalanan:</span>
              <strong>{totalEstimate.toFixed(3)} kg CO₂</strong>
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

      {/* FOOTER SECTION */}
      <footer className="main-footer">
        <p>&copy; 2026 CarbonWise. All rights reserved.</p>
      </footer>

      {/* OVERLAY ANIMASI MENYIMPAN & SUKSES */}
      <SaveStatusOverlay status={saveStatus} message={saveStatus === 'saving' ? 'Menyimpan Emisi Perjalanan...' : 'Berhasil Menyimpan Progress!'} />
    </div>
  );
};

export default Travel;