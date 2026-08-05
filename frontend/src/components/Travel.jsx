import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Bike, Bus, Footprints, Trash2, Plus, Home, PenTool, Navigation, BarChart3, LogOut, Leaf, CheckCircle, AlertCircle, X } from 'lucide-react';

import '../styles/headerkalkulator.css';
import '../styles/shared/footer.css';
import '../styles/travel.css';

const Travel = () => {
  const navigate = useNavigate();
  const [masterItems, setMasterItems] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [distance, setDistance] = useState('');
  const [travelLogs, setTravelLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State Toast Alert
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Gagal membaca data user dari localStorage:', err);
      }
    }
  }, []);

  const userName = user?.fullName || user?.name || user?.username || 'User';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  useEffect(() => {
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

        if (response.ok && result.success) {  
          const travelItems = result.data.filter(
            (item) => item.category_type && item.category_type.toUpperCase() === 'TRAVEL'
          );
          setMasterItems(travelItems);
        } else {
          showNotification(result.message || 'Gagal mengambil data master', 'error');
        }
      } catch (error) {
        console.error('Gagal mengambil master data travel:', error);
        showNotification('Gagal terhubung ke server backend!', 'error');
      }
    };

    fetchMasterItems();
  }, []);

  const renderVehicleIcon = (itemName) => {
    const name = itemName.toLowerCase();
    if (name.includes('mobil')) return <Car size={26} className="vehicle-icon" />;
    if (name.includes('motor')) return <Bike size={26} className="vehicle-icon" />;
    if (name.includes('bus')) return <Bus size={26} className="vehicle-icon" />;
    if (name.includes('jalan')) return <Footprints size={26} className="vehicle-icon" />;
    return <Car size={26} className="vehicle-icon" />;
  };

  const handleAddLog = () => {
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

    setTravelLogs([...travelLogs, newLog]);
    showNotification(`${selectedVehicle.item_name} (${distance} ${selectedVehicle.unit}) ditambahkan!`, 'success');
    
    setSelectedVehicle(null);
    setDistance('');
  };

  const handleRemoveLog = (tempId, name) => {
    setTravelLogs(travelLogs.filter((item) => item.temp_id !== tempId));
    showNotification(`Item ${name} dihapus dari daftar`, 'error');
  };

  const calculateTotalEstimate = () => {
    return travelLogs.reduce((total, item) => total + (item.quantity_value * item.emission_factor), 0);
  };

  const handleSaveData = async () => {
    if (travelLogs.length === 0) {
      showNotification('Belum ada data perjalanan untuk disimpan!', 'error');
      return;
    }

    setIsLoading(true);

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
        showNotification('Data emisi berhasil disimpan!', 'success');
        
        setTravelLogs([]);

        setTimeout(() => {
          navigate('/analytics');
        }, 1200);
      } else {
        showNotification(result.message || 'Gagal menyimpan data ke server!', 'error');
      }
    } catch (error) {
      console.error('Error submitting emission:', error);
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

          <div className="calc-total-emissions-badge">
            <span>Total Emisi:</span>
            <strong>— kg CO₂</strong>
          </div>
        </div>

        <div className="calc-header-right">
          <div className="calc-user-profile">
            <div className="calc-avatar">{userInitial}</div>
            <span className="calc-user-name">{userName}</span>
          </div>

          {/* ✅ FIX 2: DIPASANG ONCLICK HANDLER LOGOUT */}
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
            <Link to="/" className="nav-item">
              <Home size={22} />
              <span>Home</span>
            </Link>
            <Link to="/input" className="nav-item">
              <PenTool size={22} />
              <span>Input</span>
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
              <strong>{calculateTotalEstimate().toFixed(3)} kg CO₂</strong>
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
    </div>
  );
};

export default Travel;