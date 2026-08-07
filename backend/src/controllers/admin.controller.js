import adminService from '../services/admin.service.js';

export const getStudentRecords = async (req, res) => {
  try {
    const { search, school, classGrade, page, limit } = req.query;
    const result = await adminService.getStudentRecords({
      search: search || '',
      school: school || '',
      classGrade: classGrade || '',
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
    const { month, year } = req.query;
    const analytics = await adminService.getStudentAnalytics(id, month, year);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil grafik siswa!',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
