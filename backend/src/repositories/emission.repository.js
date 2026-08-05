import pool from '../configs/db.js';

class EmissionRepository {
  // Ambil semua master data untuk dikirim ke FE
  async getAllMasterItems() {
    const query = `
      SELECT id, category_type, item_name, emission_factor, unit 
      FROM emission_categories 
      ORDER BY category_type ASC, item_name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Simpan kalkulasi ke DB (menggunakan Transaction)
  async createEmissionLog(userId, totalCo2, itemsDetail) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert Header Transaksi (emission_logs)
      const logQuery = `
        INSERT INTO emission_logs (user_id, total_co2_kg)
        VALUES ($1, $2)
        RETURNING id, user_id, logged_at, total_co2_kg
      `;
      const logResult = await client.query(logQuery, [userId, totalCo2]);
      const newLog = logResult.rows[0];

      // 2. Insert Detail Transaksi (emission_log_details)
      const detailQuery = `
        INSERT INTO emission_log_details (log_id, category_id, quantity_value, calculated_co2_kg)
        VALUES ($1, $2, $3, $4)
      `;

      for (const item of itemsDetail) {
        await client.query(detailQuery, [
          newLog.id,
          item.category_id,
          item.quantity_value,
          item.calculated_co2_kg
        ]);
      }

      await client.query('COMMIT');
      return newLog;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Helper untuk mengambil faktor emisi berdasarkan list category_id
  async getCategoriesByIds(categoryIds) {
    const query = `
      SELECT id, emission_factor 
      FROM emission_categories 
      WHERE id = ANY($1::int[])
    `;
    const result = await pool.query(query, [categoryIds]);
    return result.rows;
  }
}

export default new EmissionRepository();