import pool from '../configs/db.js';

class EmissionRepository {
  async getAllMasterItems() {
    const query = `
      SELECT 
        i.id,
        c.name AS category_type,
        i.item_name,
        i.co2_factor_per_unit AS emission_factor,
        i.unit
      FROM emission_items i
      JOIN emission_categories c ON i.category_id = c.id
      ORDER BY c.name ASC, i.item_name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getItemsByIds(itemIds) {
    const query = `
      SELECT 
        i.id,
        i.category_id,
        i.item_name,
        i.co2_factor_per_unit,
        i.unit,
        c.name AS category_type
      FROM emission_items i
      JOIN emission_categories c ON i.category_id = c.id
      WHERE i.id = ANY($1::int[])
    `;
    const result = await pool.query(query, [itemIds]);
    return result.rows;
  }

  async createEmissionLogsBatch(userId, totalCo2, itemsDetail) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const batchQuery = `
        INSERT INTO calculation_batches (user_id, total_batch_co2) 
        VALUES ($1, $2) 
        RETURNING id, created_at
      `;
      const batchResult = await client.query(batchQuery, [userId, totalCo2]);
      const batchId = batchResult.rows[0].id;

      const logQuery = `
        INSERT INTO emission_logs (batch_id, user_id, category_id, item_id, quantity, calculated_co2)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, batch_id, user_id, category_id, item_id, quantity, calculated_co2, logged_at
      `;

      const insertedLogs = [];
      for (const item of itemsDetail) {
        const logResult = await client.query(logQuery, [
          batchId,
          userId,
          item.category_id,
          item.item_id,
          item.quantity,
          item.calculated_co2
        ]);
        insertedLogs.push(logResult.rows[0]);
      }

      await client.query('COMMIT');
      return {
        batch_id: batchId,
        logs: insertedLogs
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new EmissionRepository();