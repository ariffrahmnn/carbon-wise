import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, FileSpreadsheet, LogOut, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildApiUrl } from '../config/api.js';
const appIcon = '/Icon.png';
import * as XLSX from 'xlsx';

import StudentAnalyticsModal from '../components/admin/StudentAnalyticsModal.jsx';
import ScrollHint from '../components/common/ScrollHint.jsx';
import '../styles/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter Periode Waktu Dinamis (Default: September 2026 - Proyek Jejak Karbonku)
  const [selectedPeriod, setSelectedPeriod] = useState('9-2026');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  // Search input state dengan TEKNIK DEBOUNCE (400ms)
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    limit: 10
  });

  // Modal State untuk Grafik Siswa
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Data profil Admin dari localStorage
  const savedUser = localStorage.getItem('user');
  let adminUser = null;
  try {
    adminUser = JSON.parse(savedUser);
  } catch (e) {}

  let adminNameRaw = adminUser?.fullName || adminUser?.full_name || adminUser?.name || 'Admin User';
  const adminName = adminNameRaw === 'Peneliti CarbonWise' ? 'Peneliti CarbonWiseCalc' : adminNameRaw;
  const adminInitial = adminName.charAt(0).toUpperCase();

  // 1. Debounce Effect: Menunda pengubahan debouncedSearch hingga 400ms setelah user berhenti mengetik
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1); // Reset ke halaman 1 saat keyword search berubah
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // 2. Load daftar sekolah unik (DISTINCT) untuk dropdown filter
  useEffect(() => {
    fetchDistinctSchools();
  }, []);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case '9-2026': return 'September 2026 (15 - 28 Sep)';
      case '10-2026': return 'Oktober 2026';
      case '8-2026': return 'Agustus 2026';
      case 'all': return 'Semua Waktu';
      default: return selectedPeriod;
    }
  };

  const getWeekLabels = () => {
    if (selectedPeriod === '9-2026' || selectedPeriod === 'all') {
      return {
        w1: 'Minggu 1 (15 - 21 Sep)',
        w2: 'Minggu 2 (22 - 28 Sep)'
      };
    }
    if (selectedPeriod === '10-2026') {
      return {
        w1: 'Minggu 1 (1 - 7 Okt)',
        w2: 'Minggu 2 (8 - 14 Okt)'
      };
    }
    return {
      w1: 'Minggu 1',
      w2: 'Minggu 2'
    };
  };

  // 3. Fetch data rekor siswa saat debouncedSearch, selectedSchool, selectedPeriod, atau currentPage berubah
  useEffect(() => {
    fetchStudentRecords();
  }, [debouncedSearch, selectedSchool, selectedPeriod, currentPage]);

  const fetchDistinctSchools = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/v1/admin/schools'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        setSchoolsList(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch distinct schools:', err);
    }
  };

  const fetchStudentRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let month = '';
      let year = '';
      if (selectedPeriod && selectedPeriod !== 'all') {
        const [m, y] = selectedPeriod.split('-');
        month = m;
        year = y;
      }

      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        school: selectedSchool,
        month,
        year,
        page: currentPage,
        limit: 10
      });

      const response = await fetch(buildApiUrl(`/api/v1/admin/students?${queryParams.toString()}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        setStudents(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch student records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fitur Export ke Excel 2 Sheet: Rekap Siswa & Rincian Harian (SheetJS XLSX)
  const handleExportExcel = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      let month = '';
      let year = '';
      if (selectedPeriod && selectedPeriod !== 'all') {
        const [m, y] = selectedPeriod.split('-');
        month = m;
        year = y;
      }

      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        school: selectedSchool,
        month,
        year,
        page: 1,
        limit: 99999
      });

      // 1. Ambil data rekap seluruh siswa untuk Sheet 1
      const resStudents = await fetch(buildApiUrl(`/api/v1/admin/students?${queryParams.toString()}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resultStudents = await resStudents.json();
      const exportData = resultStudents.data || [];

      if (exportData.length === 0) {
        alert('Tidak ada data rekor siswa untuk diekspor!');
        return;
      }

      // 2. Ambil data rincian emisi harian siswa untuk Sheet 2
      const resDetails = await fetch(buildApiUrl(`/api/v1/admin/students/export-details?${queryParams.toString()}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resultDetails = await resDetails.json();
      const detailsData = resultDetails.data || [];

      // Sheet 1: Rekapitulasi Siswa (Termasuk Minggu 1 & Minggu 2)
      const weekLabels = getWeekLabels();
      const periodColName = selectedPeriod === 'all' 
        ? 'TOTAL PERIODE (kg CO2)' 
        : `TOTAL ${getPeriodLabel().toUpperCase()} (kg CO2)`;

      const excelDataSheet1 = exportData.map((s, idx) => ({
        'NO': idx + 1,
        'NAMA LENGKAP': s.full_name,
        'SEKOLAH': s.school_name || '-',
        'KELAS': s.class_grade || '-',
        'EMAIL': s.email,
        [`${weekLabels.w1} (kg CO2)`]: parseFloat(s.minggu_1 || 0).toFixed(2),
        [`${weekLabels.w2} (kg CO2)`]: parseFloat(s.minggu_2 || 0).toFixed(2),
        [periodColName]: parseFloat(s.total_period || 0).toFixed(2),
        'RATA-RATA HARIAN (kg CO2)': parseFloat(s.avg_daily || 0).toFixed(2),
        'HARI AKTIF MENGISI': parseInt(s.days_count || 0),
        'TOTAL KESELURUHAN (All-Time kg CO2)': parseFloat(s.total_all_time || 0).toFixed(2)
      }));

      // Sheet 2: Rincian Emisi Per Hari
      const excelDataSheet2 = detailsData.map((d, idx) => ({
        'NO': idx + 1,
        'NAMA SISWA': d.full_name,
        'SEKOLAH': d.school_name || '-',
        'KELAS': d.class_grade || '-',
        'EMAIL': d.email,
        'MINGGU': d.week_name || '-',
        'TANGGAL': d.formatted_date || (d.date ? String(d.date).split('T')[0] : '-'),
        'HARI': d.day_name || '-',
        'EMISI HARIAN (kg CO2)': parseFloat(d.daily_co2 || 0).toFixed(2)
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet1 = XLSX.utils.json_to_sheet(excelDataSheet1);
      const worksheet2 = XLSX.utils.json_to_sheet(excelDataSheet2);

      XLSX.utils.book_append_sheet(workbook, worksheet1, 'Rekap_Siswa');
      XLSX.utils.book_append_sheet(workbook, worksheet2, 'Rincian_Harian');

      const periodFileSuffix = selectedPeriod === 'all' 
        ? 'Semua_Waktu' 
        : getPeriodLabel().replace(/\s+/g, '_');

      XLSX.writeFile(workbook, `Rekor_Emisi_Siswa_CarbonWise_${periodFileSuffix}.xlsx`);
    } catch (err) {
      console.error('Failed to export student records to Excel:', err);
      alert('Gagal mengunduh file Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenStudentModal = (student) => {
    setSelectedStudentForModal(student);
    setIsModalOpen(true);
  };

  const startEntryIndex = (currentPage - 1) * pagination.limit + 1;
  const endEntryIndex = Math.min(currentPage * pagination.limit, pagination.totalRecords);

  return (
    <div className="admin-wrapper">
      {/* HEADER ATAS ADMIN DASHBOARD */}
      <header className="admin-header">
        <div className="admin-header-top-row">
          {/* BRAND LOGO CARBONWISE (DITAMPILKAN KHUSUS TAMPILAN DESKTOP) */}
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <img src={appIcon} alt="CarbonWise Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            </div>
            <span className="admin-brand-title">CarbonWiseCalc</span>
          </div>

          {/* PROFIL ADMIN & LOGOUT DIDEKATKAN DI SISI KANAN */}
          <div className="admin-header-right">
            <div className="admin-header-user">
              <div className="admin-header-avatar">{adminInitial}</div>
              <div className="admin-header-info">
                <span className="admin-header-name">{adminName}</span>
                <span className="admin-header-role">Administrator</span>
              </div>
            </div>

            <button type="button" className="admin-header-logout" onClick={handleLogout} title="Keluar">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* SEARCH INPUT DI BAWAH PROFIL & LOGOUT */}
        <div className="admin-search-box">
          <Search size={18} className="admin-search-icon" />
          <input 
            type="text" 
            className="admin-search-input"
            placeholder="Search records..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </header>

      {/* AREA UTAMA DOKUMEN ADMIN */}
      <main className="admin-main-area">
        {/* BODY DASHBOARD REKOR SISWA */}
        <div className="admin-content-body">
          <div className="admin-page-heading">
            <div>
              <h1 className="admin-title">Student records</h1>
              <p className="admin-subtitle">
                Effortlessly track, evaluate, and manage student carbon footprint submissions to support sustainability goals.
              </p>
            </div>

            <div className="admin-action-group">
              {/* TOMBOL FILTER SEKOLAH UNIK */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className="admin-filter-btn"
                  onClick={() => {
                    setShowFilterDropdown(!showFilterDropdown);
                    setShowPeriodDropdown(false);
                  }}
                >
                  <Filter size={16} />
                  <span>Filter {selectedSchool ? `(${selectedSchool})` : ''}</span>
                </button>

                {/* DROPDOWN FILTER SEKOLAH DEDUPLIKASI */}
                {showFilterDropdown && (
                  <div className="admin-filter-dropdown">
                    <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', color: '#4a0e17' }}>
                      Pilih Sekolah:
                    </strong>
                    <select 
                      value={selectedSchool}
                      onChange={(e) => {
                        setSelectedSchool(e.target.value);
                        setCurrentPage(1);
                        setShowFilterDropdown(false);
                      }}
                      className="admin-filter-select"
                    >
                      <option value="">-- Semua Sekolah --</option>
                      {schoolsList.map((sch, i) => {
                        const schoolName = (typeof sch === 'string' ? sch : (sch?.school_name || '')).trim();
                        const count = typeof sch === 'object' && sch?.student_count ? ` (${sch.student_count} siswa)` : '';
                        if (!schoolName) return null;
                        return (
                          <option key={i} value={schoolName}>
                            {schoolName}{count}
                          </option>
                        );
                      })}
                    </select>
                    {selectedSchool && (
                      <button 
                        type="button" 
                        className="admin-reset-filter-btn"
                        onClick={() => {
                          setSelectedSchool('');
                          setCurrentPage(1);
                          setShowFilterDropdown(false);
                        }}
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* TOMBOL FILTER PERIODE WAKTU */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className="admin-filter-btn"
                  onClick={() => {
                    setShowPeriodDropdown(!showPeriodDropdown);
                    setShowFilterDropdown(false);
                  }}
                >
                  <Calendar size={16} />
                  <span>Periode: {getPeriodLabel()}</span>
                </button>

                {/* DROPDOWN FILTER PERIODE */}
                {showPeriodDropdown && (
                  <div className="admin-filter-dropdown" style={{ minWidth: '250px' }}>
                    <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', color: '#4a0e17' }}>
                      Pilih Periode Emisi:
                    </strong>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => {
                        setSelectedPeriod(e.target.value);
                        setCurrentPage(1);
                        setShowPeriodDropdown(false);
                      }}
                      className="admin-filter-select"
                    >
                      <option value="9-2026">September 2026 (Jejak Karbonku)</option>
                      <option value="10-2026">Oktober 2026 (Bulan Ini)</option>
                      <option value="all">Semua Waktu (All Time)</option>
                      <option value="8-2026">Agustus 2026</option>
                    </select>
                    {selectedPeriod !== '9-2026' && (
                      <button 
                        type="button" 
                        className="admin-reset-filter-btn"
                        onClick={() => {
                          setSelectedPeriod('9-2026');
                          setCurrentPage(1);
                          setShowPeriodDropdown(false);
                        }}
                      >
                        Kembali ke September 2026
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* TOMBOL EXPORT KE EXCEL 2 SHEET */}
              <button 
                type="button" 
                className="admin-export-btn"
                onClick={handleExportExcel}
                disabled={isExporting}
                style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'wait' : 'pointer' }}
              >
                <FileSpreadsheet size={16} />
                <span>{isExporting ? 'Mengekspor 2 Sheet...' : 'Ekspor Excel'}</span>
              </button>
            </div>
          </div>

          {/* TABEL REKOR SISWA (DENGAN RUANG YANG MENGISI CONTAINER SECARA PROPORSIONAL) */}
          <div className="admin-table-card">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>NO</th>
                    <th>NAMA LENGKAP</th>
                    <th>SEKOLAH</th>
                    <th>KELAS</th>
                    <th>EMAIL</th>
                    <th style={{ color: '#b45309' }}>{getWeekLabels().w1.toUpperCase()}</th>
                    <th style={{ color: '#0284c7' }}>{getWeekLabels().w2.toUpperCase()}</th>
                    <th>TOTAL PERIODE</th>
                    <th>RATA-RATA HARIAN</th>
                    <th>TOTAL ALL-TIME</th>
                    <th style={{ width: '70px', textAlign: 'center' }}>DETAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="admin-table-empty">
                        Memuat data rekor siswa...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="admin-table-empty">
                        Tidak ada data siswa ditemukan.
                      </td>
                    </tr>
                  ) : (
                    students.map((student, idx) => (
                      <tr key={student.id || idx}>
                        <td className="col-no">{startEntryIndex + idx}</td>
                        <td className="col-name">{student.full_name}</td>
                        <td className="col-school">{student.school_name || '-'}</td>
                        <td className="col-class">{student.class_grade || '-'}</td>
                        <td className="col-email">{student.email}</td>
                        <td className="col-emission" style={{ color: '#b45309', fontWeight: 'bold' }}>
                          {parseFloat(student.minggu_1 || 0).toFixed(2)} kg
                        </td>
                        <td className="col-emission" style={{ color: '#0284c7', fontWeight: 'bold' }}>
                          {parseFloat(student.minggu_2 || 0).toFixed(2)} kg
                        </td>
                        <td className="col-emission daily" style={{ fontWeight: 'bold' }}>
                          {parseFloat(student.total_period || 0).toFixed(2)} kg
                        </td>
                        <td className="col-emission weekly">
                          {parseFloat(student.avg_daily || 0).toFixed(2)} kg
                        </td>
                        <td className="col-emission monthly">
                          {parseFloat(student.total_all_time || 0).toFixed(2)} kg
                        </td>
                        <td className="col-action">
                          <button 
                            type="button" 
                            className="admin-action-dots-btn"
                            title="Lihat Detail Grafik Siswa"
                            onClick={() => handleOpenStudentModal(student)}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="admin-table-footer">
              <div className="admin-entries-info">
                Showing {pagination.totalRecords > 0 ? startEntryIndex : 0} to {endEntryIndex} of {pagination.totalRecords} entries
              </div>

              <div className="admin-pagination-controls">
                <button
                  type="button"
                  className="admin-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    className={`admin-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="admin-page-btn"
                  disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 3 GRAFIK EMISI SISWA */}
      <StudentAnalyticsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentProfile={selectedStudentForModal}
      />
    </div>
  );
};

export default AdminDashboard;
