import adminRepository from '../repositories/admin.repository.js';

class AdminService {
  async getStudentRecords(params) {
    return await adminRepository.getAllStudentRecords(params);
  }

  async getDistinctSchools() {
    return await adminRepository.getDistinctSchools();
  }

  async getStudentAnalytics(userId, month, year) {
    return await adminRepository.getStudentAnalytics(userId, month, year);
  }
}

export default new AdminService();
