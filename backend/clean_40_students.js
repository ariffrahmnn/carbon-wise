import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/configs/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanSeed() {
  const client = await pool.connect();
  try {
    console.log('🧹 Memulai Pembersihan Data 40 Siswa Proyek "Jejak Karbonku"...');

    const dataPath = path.resolve(__dirname, 'data/client_seed_40_students.json');
    let emails = [];
    if (fs.existsSync(dataPath)) {
      const studentsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      emails = studentsData.map(s => s.email);
    }

    await client.query('BEGIN');

    // Hapus users berdasarkan list email atau kelas X.11 SMAN 1 Pekanbaru
    const result = await client.query(`
      DELETE FROM users 
      WHERE (email = ANY($1::varchar[]) OR (school_name = 'SMAN 1 Pekanbaru' AND class_grade = 'X.11'))
        AND role::text != 'ADMIN'
      RETURNING id, full_name, email
    `, [emails]);

    await client.query('COMMIT');
    console.log(`✅ BERHASIL DIBERSIHKAN!`);
    console.log(`   • Total Akun Dihapus: ${result.rows.length} siswa`);
    console.log(`   • Seluruh calculation_batches & emission_logs terkait otomatis terhapus (CASCADE).\n`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal membersihkan data:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

cleanSeed();
