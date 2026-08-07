import { query } from '../configs/db.js';

class UserRepository {
  async findByEmail(email) {
    try {
      const sql = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await query(sql, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findByFullName(fullName) {
    try {
      const sql = 'SELECT * FROM users WHERE TRIM(full_name) ILIKE TRIM($1)';
      const { rows } = await query(sql, [fullName]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findAllByIdentifier(identifier) {
    try {
      const clean = identifier.trim();
      const sql = 'SELECT * FROM users WHERE email ILIKE $1 OR TRIM(full_name) ILIKE $1';
      const { rows } = await query(sql, [clean]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const {
        fullName,
        email,
        passwordHash,
        schoolName,
        classGrade,
        role = 'USER'
      } = userData;

      const sql = `
        INSERT INTO users (full_name, email, password_hash, school_name, class_grade, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, full_name, email, role, school_name, class_grade, created_at
      `;

      const values = [fullName, email, passwordHash, schoolName, classGrade, role];
      const { rows } = await query(sql, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();