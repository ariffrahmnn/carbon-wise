import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Bike, 
  Bus, 
  Footprints, 
  Trash2, 
  Plus, 
  Home, 
  PenTool, 
  Navigation, 
  BarChart3, 
  LogOut, 
  Leaf,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

import '../styles/headerkalkulator.css';
import '../styles/footer.css';
import '../styles/travel.css';

const Travel = () => {
  const vehicleFactors = {
    'Mobil': 0.12,
    'Motor': 0.05,
    'Bus': 0.08,
    'Jalan Kaki': 0.00
  };

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [distance, setDistance] = useState('');
  const [travelLogs, setTravelLogs] = useState([
    { id: 1, name: 'Mobil', km: 2, factor: 0.12 },
    { id: 2, name: 'Motor', km: 2, factor: 0.05 },
  ]);

  // State Toast Alert Responsif
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const userName = "Fikri Azhar";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  const renderVehicleIcon = (vehicleName) => {
    switch (vehicleName) {
      case 'Mobil':
        return <Car size={26} className="vehicle-icon" />;
      case 'Motor':
        return <Bike size={26} className="vehicle-icon" />;
      case 'Bus':
        return <Bus size={26} className="vehicle-icon" />;
      case 'Jalan Kaki':
        return <Footprints size={26} className="vehicle-icon" />;
      default:
        return <Car size={26} className="vehicle-icon" />;
    }
  };

  const handleRemoveLog = (id, name) => {
    setTravelLogs(travelLogs.filter((item) => item.id !== id));
    showNotification(`Perjalanan ${name} berhasil dihapus`, 'error');
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
    
    setTravelLogs([
      ...travelLogs,
      { 
        id: Date.now(), 
        name: selectedVehicle, 
        km: parseFloat(distance),
        factor: vehicleFactors[selectedVehicle] || 0
      }
    ]);
    
    showNotification(`${selectedVehicle} (${distance} km) berhasil ditambahkan!`, 'success');
    setSelectedVehicle(null);
    setDistance('');
  };

  const handleSaveData = () => {
    if (travelLogs.length === 0) {
      showNotification('Belum ada data perjalanan untuk disimpan!', 'error');
      return;
    }
    showNotification('Data perjalanan berhasil disimpan!', 'success');
  };

  const calculateTotalEstimate = () => {
    return travelLogs.reduce((total, item) => total + (item.km * item.factor), 0);
  };

  return (
    <div className="layout-wrapper">
      {/* Toast Alert Floating untuk Mobile & Desktop */}
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

          <button className="calc-btn-logout" title="Keluar" type="button">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="main-body">
        {/* SIDEBAR SECTION */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/home" className="nav-item">
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
            
            {/* Grid Pilihan Kendaraan */}
            <div className="vehicle-grid">
              {['Mobil', 'Motor', 'Bus', 'Jalan Kaki'].map((vehicle) => (
                <button
                  key={vehicle}
                  type="button"
                  className={`vehicle-card ${selectedVehicle === vehicle ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="vehicle-icon-wrapper">
                    {renderVehicleIcon(vehicle)}
                  </div>
                  <span className="vehicle-label">{vehicle}</span>
                </button>
              ))}
            </div>

            {/* Form Input Jarak */}
            {selectedVehicle && (
              <div className="distance-input-card">
                <p className="selected-info">
                  Kendaraan Terpilih: <strong>{selectedVehicle}</strong>
                </p>
                <div className="input-inline">
                  <input
                    type="number"
                    className="distance-field"
                    placeholder="Masukkan jarak (km)"
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
                  <div key={log.id} className="log-card">
                    <span className="log-detail">
                      <strong>{log.name}</strong> - {log.km} km
                    </span>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleRemoveLog(log.id, log.name)}
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
            <button type="button" className="btn-submit-all" onClick={handleSaveData}>
              Simpan
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