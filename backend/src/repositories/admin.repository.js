import pool from '../configs/db.js';

class AdminRepository {
  // Mengambil daftar rekor siswa dengan fitur pencarian ILIKE, filter sekolah unik, dan agregasi emisi
  async getAllStudentRecords({ search = '', school = '', classGrade = '', page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const cleanSearch = search.trim();
    const cleanSchool = school.trim();
    const cleanClass = classGrade.trim();

    let whereConditions = [`u.role::text NOT ILIKE 'admin'`];
    let queryParams = [];
    let paramIndex = 1;

    if (cleanSearch) {
      whereConditions.push(`(u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.school_name ILIKE $${paramIndex})`);
      queryParams.push(`%${cleanSearch}%`);
      paramIndex++;
    }

    if (cleanSchool) {
      whereConditions.push(`TRIM(u.school_name) ILIKE $${paramIndex}`);
      queryParams.push(`%${cleanSchool}%`);
      paramIndex++;
    }

    if (cleanClass) {
      whereConditions.push(`TRIM(u.class_grade) ILIKE $${paramIndex}`);
      queryParams.push(`%${cleanClass}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query Hitung Total Rekor untuk Paginasi
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM users u 
      ${whereClause}
    `;
    const countRes = await pool.query(countQuery, queryParams);
    const totalRecords = parseInt(countRes.rows[0].total || 0);

    // Query Utama Rekor Siswa + Total Emisi Harian, Mingguan, Bulanan
    const mainQuery = `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.school_name,
        u.class_grade,
        COALESCE(daily.total_daily, 0) AS total_daily,
        COALESCE(weekly.total_weekly, 0) AS total_weekly,
        COALESCE(monthly.total_monthly, 0) AS total_monthly
      FROM users u
      LEFT JOIN (
        SELECT user_id, SUM(total_batch_co2) AS total_daily
        FROM calculation_batches
        WHERE DATE(created_at) = CURRENT_DATE
        GROUP BY user_id
      ) daily ON u.id = daily.user_id
      LEFT JOIN (
        SELECT user_id, SUM(total_batch_co2) AS total_weekly
        FROM calculation_batches
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY user_id
      ) weekly ON u.id = weekly.user_id
      LEFT JOIN (
        SELECT user_id, SUM(total_batch_co2) AS total_monthly
        FROM calculation_batches
        WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY user_id
      ) monthly ON u.id = monthly.user_id
      ${whereClause}
      ORDER BY u.full_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(mainQuery, queryParams);

    return {
      students: result.rows,
      pagination: {
        totalRecords,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        limit: parseInt(limit)
      }
    };
  }

  // Mengambil daftar nama sekolah unik (Deduplikasi 1 nama per sekolah)
  async getDistinctSchools() {
    const query = `
      SELECT DISTINCT TRIM(school_name) AS school_name 
      FROM users 
      WHERE school_name IS NOT NULL 
        AND TRIM(school_name) != '' 
        AND role::text NOT ILIKE 'admin' 
      ORDER BY school_name ASC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.school_name);
  }

  // Mengambil data analitik grafik harian, mingguan, dan bulanan siswa tertentu untuk modal admin
  async getStudentAnalytics(userId, targetMonth, targetYear) {
    const now = new Date();
    const month = targetMonth ? parseInt(targetMonth) : now.getMonth() + 1;
    const year = targetYear ? parseInt(targetYear) : now.getFullYear();

    // Ambil detail profil siswa
    const userQuery = `SELECT id, full_name, email, school_name, class_grade FROM users WHERE id = $1`;
    const userRes = await pool.query(userQuery, [userId]);
    const studentProfile = userRes.rows[0];

    const dailyQuery = `
      SELECT 
        TO_CHAR(created_at, 'HH24:MI') AS formatted_time,
        TRIM(TO_CHAR(created_at, 'Day')) AS day_name,
        TO_CHAR(created_at, 'DD Mon YYYY') AS formatted_date,
        SUM(total_batch_co2) AS total 
      FROM calculation_batches 
      WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE 
      GROUP BY created_at, formatted_time, day_name, formatted_date 
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

    const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
      pool.query(dailyQuery, [userId]),
      pool.query(weeklyQuery, [userId]),
      pool.query(monthlyQuery, [userId, month, year])
    ]);

    return {
      profile: studentProfile,
      daily: dailyRes.rows,
      weekly: weeklyRes.rows,
      monthly: monthlyRes.rows
    };
  }
}

export default new AdminRepository();
