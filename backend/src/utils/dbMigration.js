import { query } from '../configs/db.js';

export const ensureSchema = async () => {
  try {
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local'
    `);
    console.log('✅ Database Schema: Kolom auth_provider terkonfirmasi siap!');
  } catch (err) {
    console.warn('⚠️ Warning: Gagal menambahkan kolom auth_provider:', err.message);
  }
};
