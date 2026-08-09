import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';

export const autoSeedDefaultAdmin = async () => {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
    const fullName = process.env.DEFAULT_ADMIN_NAME || process.env.ADMIN_NAME || 'admincarbonwise';

    if (!email || !rawPassword) {
      return;
    }

    const cleanEmail = email.trim();
    const cleanPassword = rawPassword.trim();
    const cleanName = fullName.trim();

    const existingUser = await userRepository.findByEmail(cleanEmail);

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(cleanPassword, 10);
      await userRepository.createUser({
        fullName: cleanName,
        email: cleanEmail,
        passwordHash,
        schoolName: 'CarbonWise Admin',
        classGrade: 'ADMIN',
        role: 'ADMIN'
      });
      console.log(`👑 Auto-Seeder: Akun Admin Default (${cleanEmail}) berhasil dibuat!`);
    } else if (existingUser.role !== 'ADMIN') {
      await userRepository.updateUserRole(existingUser.id, 'ADMIN');
      console.log(`👑 Auto-Seeder: Role akun (${cleanEmail}) berhasil diubah menjadi ADMIN!`);
    }
  } catch (err) {
    console.error('❌ Auto-Seeder Admin Error:', err.message);
  }
};
