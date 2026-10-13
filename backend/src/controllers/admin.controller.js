import adminService from '../services/admin.service.js';

export const getStudentRecords = async (req, res) => {
  try {
    const { search, school, classGrade, month, year, page, limit } = req.query;
    const result = await adminService.getStudentRecords({
      search: search || '',
      school: school || '',
      classGrade: classGrade || '',
      month: month || '',
      year: year || '',
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    });

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil rekor siswa!',
      data: result.students,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentExportDetails = async (req, res) => {
  try {
    const { search, school, classGrade, month, year } = req.query;
    const details = await adminService.getStudentExportDetails({
      search: search || '',
      school: school || '',
      classGrade: classGrade || '',
      month: month || '',
      year: year || ''
    });

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil rincian ekspor siswa!',
      data: details
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDistinctSchools = async (req, res) => {
  try {
    const schools = await adminService.getDistinctSchools();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar sekolah unik!',
      data: schools
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, weekOffset, dayOffset } = req.query;
    const analytics = await adminService.getStudentAnalytics(id, month, year, weekOffset, dayOffset);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil grafik siswa!',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
