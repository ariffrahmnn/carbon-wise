import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileSpreadsheet, LogOut, MoreVertical, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
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

  // Data profil Admin dari localStorage
  const savedUser = localStorage.getItem('user');
  let adminUser = null;
  try {
    adminUser = JSON.parse(savedUser);
  } catch (e) {}

  const adminName = adminUser?.fullName || adminUser?.full_name || adminUser?.name || 'Admin User';
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

  // 3. Fetch data rekor siswa saat debouncedSearch, selectedSchool, atau currentPage berubah
  useEffect(() => {
    fetchStudentRecords();
  }, [debouncedSearch, selectedSchool, currentPage]);

  const fetchDistinctSchools = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/admin/schools', {
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
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        school: selectedSchool,
        page: currentPage,
        limit: 10
      });

      const response = await fetch(`http://localhost:3000/api/v1/admin/students?${queryParams.toString()}`, {
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

  // Fitur Export ke Excel (SheetJS XLSX)
  const handleExportExcel = () => {
    if (students.length === 0) {
      alert('Tidak ada data rekor siswa untuk diekspor!');
      return;
    }

    const excelData = students.map((s, idx) => ({
      'NO': idx + 1 + (currentPage - 1) * pagination.limit,
      'NAMA LENGKAP': s.full_name,
      'SEKOLAH': s.school_name || '-',
      'KELAS': s.class_grade || '-',
      'EMAIL': s.email,
      'TOTAL HARIAN (kg CO2)': parseFloat(s.total_daily || 0).toFixed(3),
      'WEEKLY (kg CO2)': parseFloat(s.total_weekly || 0).toFixed(3),
      'MONTHLY (kg CO2)': parseFloat(s.total_monthly || 0).toFixed(3)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekor_Siswa');

    XLSX.writeFile(workbook, `Rekor_Emisi_Siswa_CarbonWise_Hal_${currentPage}.xlsx`);
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
              <Leaf size={20} color="#ffffff" />
            </div>
            <span className="admin-brand-title">CarbonWise</span>
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
                Manage and monitor daily carbon tracking submissions across the Karawang district.
              </p>
            </div>

            <div className="admin-action-group">
              {/* TOMBOL FILTER SEKOLAH UNIK */}
              <button 
                type="button" 
                className="admin-filter-btn"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
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
                    {schoolsList.map((sch, i) => (
                      <option key={i} value={sch.school_name}>
                        {sch.school_name} ({sch.student_count} siswa)
                      </option>
                    ))}
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

              {/* TOMBOL EXPORT KE EXCEL */}
              <button 
                type="button" 
                className="admin-export-btn"
                onClick={handleExportExcel}
              >
                <FileSpreadsheet size={16} />
                <span>Import Excel</span>
              </button>
            </div>
          </div>

          {/* TABEL REKOR SISWA (DENGAN RUANG YANG MENGISI CONTAINER SECARA PROPORSIONAL) */}
          <div className="admin-table-card">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>NO</th>
                    <th>NAMA LENGKAP</th>
                    <th>SEKOLAH</th>
                    <th>KELAS</th>
                    <th>EMAIL</th>
                    <th>TOTAL HARIAN</th>
                    <th>WEEKLY</th>
                    <th>MONTHLY</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="admin-table-empty">
                        Memuat data rekor siswa...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="admin-table-empty">
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
                        <td className="col-emission daily">
                          {parseFloat(student.total_daily || 0).toFixed(1)} kg
                        </td>
                        <td className="col-emission weekly">
                          {parseFloat(student.total_weekly || 0).toFixed(1)} kg
                        </td>
                        <td className="col-emission monthly">
                          {parseFloat(student.total_monthly || 0).toFixed(1)} kg
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

      {/* Indikator Scroll Mobile */}
      <ScrollHint text="Gulir ke bawah untuk lihat tabel data" />
    </div>
  );
};

export default AdminDashboard;
