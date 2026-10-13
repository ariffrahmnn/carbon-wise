import pool from '../configs/db.js';

class AdminRepository {
  // Mengambil daftar rekor siswa dengan fitur pencarian ILIKE, filter sekolah unik, filter periode waktu dinamis, dan agregasi emisi
  async getAllStudentRecords({ search = '', school = '', classGrade = '', month = '', year = '', page = 1, limit = 10 }) {
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
      queryParams.push(cleanSchool);
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

    // Period filter condition for calculation_batches
    let periodWhere = '';
    if (month && year) {
      periodWhere = `WHERE EXTRACT(MONTH FROM created_at) = $${paramIndex} AND EXTRACT(YEAR FROM created_at) = $${paramIndex + 1}`;
      queryParams.push(parseInt(month), parseInt(year));
      paramIndex += 2;
    }

    // Query Utama Rekor Siswa + Total Emisi Periode, Rata-rata Harian, dan All-Time
    const mainQuery = `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.school_name,
        u.class_grade,
        COALESCE(period.total_period, 0) AS total_period,
        COALESCE(period.days_count, 0) AS days_count,
        COALESCE(period.avg_daily, 0) AS avg_daily,
        COALESCE(all_time.total_all_time, 0) AS total_all_time,
        COALESCE(daily.total_daily, 0) AS total_daily,
        COALESCE(weekly.total_weekly, 0) AS total_weekly,
        COALESCE(monthly.total_monthly, 0) AS total_monthly
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id, 
          ROUND(SUM(total_batch_co2), 2) AS total_period,
          COUNT(DISTINCT DATE(created_at)) AS days_count,
          ROUND(SUM(total_batch_co2) / NULLIF(COUNT(DISTINCT DATE(created_at)), 0), 2) AS avg_daily
        FROM calculation_batches
        ${periodWhere}
        GROUP BY user_id
      ) period ON u.id = period.user_id
      LEFT JOIN (
        SELECT user_id, ROUND(SUM(total_batch_co2), 2) AS total_all_time
        FROM calculation_batches
        GROUP BY user_id
      ) all_time ON u.id = all_time.user_id
      LEFT JOIN (
        SELECT user_id, SUM(total_batch_co2) AS total_daily
        FROM calculation_batches
        WHERE DATE(created_at) = CURRENT_DATE
        GROUP BY user_id
      ) daily ON u.id = daily.user_id
      LEFT JOIN (
        SELECT user_id, SUM(total_batch_co2) AS total_weekly
        FROM calculation_batches
        WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '6 days'
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

  // Mengambil rincian emisi harian per siswa untuk diekspor ke Sheet 2 Excel
  async getStudentExportDetails({ search = '', school = '', classGrade = '', month = '', year = '' }) {
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
      queryParams.push(cleanSchool);
      paramIndex++;
    }

    if (cleanClass) {
      whereConditions.push(`TRIM(u.class_grade) ILIKE $${paramIndex}`);
      queryParams.push(`%${cleanClass}%`);
      paramIndex++;
    }

    if (month && year) {
      whereConditions.push(`EXTRACT(MONTH FROM b.created_at) = $${paramIndex}`);
      queryParams.push(parseInt(month));
      paramIndex++;
      whereConditions.push(`EXTRACT(YEAR FROM b.created_at) = $${paramIndex}`);
      queryParams.push(parseInt(year));
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        u.id AS user_id,
        u.full_name,
        u.school_name,
        u.class_grade,
        u.email,
        DATE(b.created_at) AS date,
        TO_CHAR(b.created_at, 'DD Mon YYYY') AS formatted_date,
        TRIM(TO_CHAR(b.created_at, 'Day')) AS day_name,
        ROUND(SUM(b.total_batch_co2), 2) AS daily_co2
      FROM calculation_batches b
      JOIN users u ON b.user_id = u.id
      ${whereClause}
      GROUP BY u.id, u.full_name, u.school_name, u.class_grade, u.email, DATE(b.created_at), formatted_date, day_name
      ORDER BY u.full_name ASC, date ASC
    `;

    const result = await pool.query(query, queryParams);
    return result.rows;
  }

  // Mengambil daftar nama sekolah unik (Deduplikasi & TRIM + Hitung Jumlah Siswa)
  async getDistinctSchools() {
    const query = `
      SELECT 
        TRIM(school_name) AS school_name,
        COUNT(id) AS student_count
      FROM users 
      WHERE school_name IS NOT NULL 
        AND TRIM(school_name) != '' 
        AND role::text NOT ILIKE 'admin' 
      GROUP BY TRIM(school_name)
      ORDER BY TRIM(school_name) ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Mengambil data analitik grafik harian, mingguan, dan bulanan siswa tertentu untuk modal admin
  async getStudentAnalytics(userId, targetMonth, targetYear, weekOffset = 0, dayOffset = 0) {
    const now = new Date();
    const month = targetMonth ? parseInt(targetMonth) : now.getMonth() + 1;
    const year = targetYear ? parseInt(targetYear) : now.getFullYear();
    const offset = parseInt(weekOffset) || 0;
    const offsetDays = offset * 7;
    const dOffset = parseInt(dayOffset) || 0;

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
      WHERE user_id = $1 
        AND DATE(created_at) = CURRENT_DATE - INTERVAL '${dOffset} days' 
      GROUP BY created_at, formatted_time, day_name, formatted_date 
      ORDER BY created_at ASC
    `;

    const weeklyQuery = `
      SELECT 
        TRIM(TO_CHAR(created_at, 'Day')) AS day_name, 
        DATE(created_at) AS date, 
        TO_CHAR(created_at, 'DD Mon YYYY') AS formatted_date,
        SUM(total_batch_co2) AS total 
      FROM calculation_batches 
      WHERE user_id = $1 
        AND DATE(created_at) >= CURRENT_DATE - INTERVAL '${offsetDays + 6} days'
        AND DATE(created_at) <= CURRENT_DATE - INTERVAL '${offsetDays} days'
      GROUP BY date, day_name, formatted_date 
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
