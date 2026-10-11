import adminRepository from '../repositories/admin.repository.js';

class AdminService {
  async getStudentRecords(params) {
    return await adminRepository.getAllStudentRecords(params);
  }

  async getDistinctSchools() {
    return await adminRepository.getDistinctSchools();
  }

  async getStudentAnalytics(userId, month, year, weekOffset, dayOffset) {
    return await adminRepository.getStudentAnalytics(userId, month, year, weekOffset, dayOffset);
  }
}

export default new AdminService();
