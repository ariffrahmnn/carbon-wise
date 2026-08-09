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

  async getUserAnalytics(userId, targetMonth, targetYear) {
    const now = new Date();
    const month = targetMonth ? parseInt(targetMonth) : now.getMonth() + 1;
    const year = targetYear ? parseInt(targetYear) : now.getFullYear();

    const dailyQuery = `
      SELECT 
        id AS batch_id,
        TO_CHAR(created_at, 'HH24:MI') AS formatted_time,
        TRIM(TO_CHAR(created_at, 'Day')) AS day_name,
        TO_CHAR(created_at, 'DD Mon YYYY') AS formatted_date,
        created_at AS time_exact,
        total_batch_co2 AS total 
      FROM calculation_batches 
      WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE 
      ORDER BY created_at ASC
    `;

    const weeklyQuery = `
      SELECT 
        TRIM(TO_CHAR(created_at, 'Day')) AS day_name, 
        DATE(created_at) AS date, 
        SUM(total_batch_co2) AS total 
      FROM calculation_batches 
      WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '6 days' 
      GROUP BY date, day_name 
      ORDER BY date ASC
    `;

    const monthlyQuery = `
      SELECT 
        'Week ' || CEIL(EXTRACT(DAY FROM created_at) / 7.0) AS week, 
        SUM(total_batch_co2) AS total 
      FROM calculation_batches 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM created_at) = $2 
        AND EXTRACT(YEAR FROM created_at) = $3 
      GROUP BY week 
      ORDER BY week ASC
    `;

    const breakdownQuery = `
      SELECT 
        i.item_name, 
        c.name AS category_name, 
        SUM(l.calculated_co2) AS total 
      FROM emission_logs l 
      JOIN emission_items i ON l.item_id = i.id 
      JOIN emission_categories c ON l.category_id = c.id 
      WHERE l.user_id = $1 AND DATE(l.logged_at) = CURRENT_DATE 
      GROUP BY i.item_name, c.name
    `;

    const batchBreakdownQuery = `
      SELECT 
        l.batch_id,
        i.item_name, 
        c.name AS category_name, 
        SUM(l.calculated_co2) AS total 
      FROM emission_logs l 
      JOIN emission_items i ON l.item_id = i.id 
      JOIN emission_categories c ON l.category_id = c.id 
      WHERE l.user_id = $1 AND DATE(l.logged_at) = CURRENT_DATE 
      GROUP BY l.batch_id, i.item_name, c.name
    `;

    const [dailyRes, weeklyRes, monthlyRes, breakdownRes, batchBreakdownRes] = await Promise.all([
      pool.query(dailyQuery, [userId]),
      pool.query(weeklyQuery, [userId]),
      pool.query(monthlyQuery, [userId, month, year]),
      pool.query(breakdownQuery, [userId]),
      pool.query(batchBreakdownQuery, [userId])
    ]);

    const batchMap = new Map();
    batchBreakdownRes.rows.forEach(row => {
      if (!batchMap.has(row.batch_id)) {
        batchMap.set(row.batch_id, []);
      }
      batchMap.get(row.batch_id).push(row);
    });

    const dailyWithBreakdown = dailyRes.rows.map(batch => ({
      ...batch,
      breakdown: batchMap.get(batch.batch_id) || []
    }));

    return {
      daily: dailyWithBreakdown,
      weekly: weeklyRes.rows,
      monthly: monthlyRes.rows,
      todayBreakdown: breakdownRes.rows
    };
  }

  async resetUserEmissionData(userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM emission_logs WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM calculation_batches WHERE user_id = $1', [userId]);
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new EmissionRepository();