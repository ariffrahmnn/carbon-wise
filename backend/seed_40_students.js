import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/configs/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const client = await pool.connect();

  try {
    console.log('🚀 Memulai Seeder Data 40 Siswa Proyek "Jejak Karbonku" (Kelas X.11)...\n');

    // 1. Baca Data JSON 40 Siswa
    const dataPath = path.resolve(__dirname, 'data/client_seed_40_students.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`File dataset tidak ditemukan: ${dataPath}`);
    }
    const studentsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`📋 Memuat ${studentsData.length} data siswa dari file JSON.`);

    // 2. Ambil Master Items dari Database
    const itemsRes = await client.query(`
      SELECT i.id, i.category_id, i.item_name, i.unit, i.co2_factor_per_unit, c.name AS category_name
      FROM emission_items i
      JOIN emission_categories c ON i.category_id = c.id
    `);

    if (itemsRes.rows.length === 0) {
      throw new Error('Master data emission_items kosong! Harap periksa database.');
    }

    const itemMap = new Map();
    itemsRes.rows.forEach(item => {
      itemMap.set(item.item_name.toLowerCase(), {
        id: item.id,
        category_id: item.category_id,
        co2_factor: parseFloat(item.co2_factor_per_unit),
        unit: item.unit
      });
    });

    console.log(`📦 Master items terdeteksi: ${itemsRes.rows.length} item.`);

    // 3. Hash Password Seragam: siswacarbon
    const passwordHash = await bcrypt.hash('siswacarbon', 10);

    let createdUsersCount = 0;
    let updatedUsersCount = 0;
    let totalBatchesCount = 0;
    let totalLogsCount = 0;

    for (const student of studentsData) {
      await client.query('BEGIN');

      // Cek apakah user sudah terdaftar berdasarkan email atau nama
      const checkUser = await client.query(`
        SELECT id FROM users 
        WHERE email = $1 OR TRIM(full_name) ILIKE TRIM($2)
        LIMIT 1
      `, [student.email, student.full_name]);

      let userId;
      if (checkUser.rows.length > 0) {
        userId = checkUser.rows[0].id;
        // Update data profil agar seragam
        await client.query(`
          UPDATE users 
          SET full_name = $1, email = $2, school_name = $3, class_grade = $4, password_hash = $5
          WHERE id = $6
        `, [student.full_name, student.email, student.school_name, student.class_grade, passwordHash, userId]);
        
        // Hapus batch & log lama siswa ini pada rentang 15-28 September 2026 agar bersih & idempotent
        await client.query(`
          DELETE FROM calculation_batches 
          WHERE user_id = $1 
            AND DATE(created_at) >= '2026-09-15' 
            AND DATE(created_at) <= '2026-09-28'
        `, [userId]);

        updatedUsersCount++;
      } else {
        // Buat akun baru
        const newUser = await client.query(`
          INSERT INTO users (full_name, email, password_hash, role, school_name, class_grade)
          VALUES ($1, $2, $3, 'USER', $4, $5)
          RETURNING id
        `, [student.full_name, student.email, passwordHash, student.school_name, student.class_grade]);
        userId = newUser.rows[0].id;
        createdUsersCount++;
      }

      // 4. Proses Log Aktivitas 14 Hari
      for (const day of student.days) {
        if (day.status !== 'Terisi' || !day.activities) {
          continue; // Hari Kosong (siswa lupa mengisi) di-skip
        }

        const act = day.activities;
        const itemEntries = [
          { key: 'motor', name: 'motor', qty: act.motor },
          { key: 'mobil', name: 'mobil', qty: act.mobil },
          { key: 'bus',   name: 'bus',   qty: act.bus },
          { key: 'jalan', name: 'jalan', qty: act.jalan },
          { key: 'nasi',  name: 'nasi',  qty: act.nasi },
          { key: 'ayam',  name: 'ayam',  qty: act.ayam },
          { key: 'daging',name: 'daging',qty: act.daging },
          { key: 'ikan',  name: 'ikan',  qty: act.ikan },
          { key: 'telur', name: 'telur', qty: act.telur_gram },
          { key: 'tahu',  name: 'tahu',  qty: act.tahu },
          { key: 'tempe', name: 'tempe', qty: act.tempe },
          { key: 'sayur', name: 'sayur', qty: act.sayur }
        ];

        const validLogs = [];
        let totalBatchCo2 = 0;

        for (const entry of itemEntries) {
          if (entry.qty && entry.qty > 0) {
            const master = itemMap.get(entry.name);
            if (master) {
              const calculatedCo2 = parseFloat((entry.qty * master.co2_factor).toFixed(4));
              totalBatchCo2 += calculatedCo2;
              validLogs.push({
                category_id: master.category_id,
                item_id: master.id,
                quantity: entry.qty,
                calculated_co2: calculatedCo2
              });
            }
          }
        }

        if (validLogs.length === 0) continue;

        totalBatchCo2 = parseFloat(totalBatchCo2.toFixed(4));

        // Buat Timestamp realistis pada tanggal tersebut (jam 13:00 - 15:00 WIB)
        const hour = Math.floor(Math.random() * 3) + 13;
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        const timestampStr = `${day.date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

        // Insert Calculation Batch
        const batchRes = await client.query(`
          INSERT INTO calculation_batches (user_id, total_batch_co2, created_at)
          VALUES ($1, $2, $3::timestamp)
          RETURNING id
        `, [userId, totalBatchCo2, timestampStr]);
        const batchId = batchRes.rows[0].id;
        totalBatchesCount++;

        // Insert Emission Logs
        for (const l of validLogs) {
          await client.query(`
            INSERT INTO emission_logs (batch_id, user_id, category_id, item_id, quantity, calculated_co2, logged_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp)
          `, [batchId, userId, l.category_id, l.item_id, l.quantity, l.calculated_co2, timestampStr]);
          totalLogsCount++;
        }
      }

      await client.query('COMMIT');
    }

    console.log('🎉 SEEDER BERHASIL DISELESAIKAN!');
    console.log(`   • Akun Siswa Baru Dibuat : ${createdUsersCount}`);
    console.log(`   • Akun Siswa Diperbarui   : ${updatedUsersCount}`);
    console.log(`   • Total Akun Diproses     : ${studentsData.length}`);
    console.log(`   • Total Batch Perhitungan : ${totalBatchesCount}`);
    console.log(`   • Total Log Rincian Emisi : ${totalLogsCount}`);
    console.log(`   • Password Default        : siswacarbon`);
    console.log(`   • Sekolah / Kelas         : SMAN 1 Pekanbaru / X.11\n`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal menjalankan seeder:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

runSeed();
