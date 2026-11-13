import dotenv from 'dotenv';
dotenv.config();

import { execSync } from 'child_process';
import path from 'path';

console.log('Running complete VietJobs database initialization on Neon...');
try {
  execSync('node scripts/seed-vietjobs-neon.mjs', { stdio: 'inherit' });
  console.log('Neon database initialized successfully with all 1,470 jobs!');
} catch (err) {
  console.error('Failed to initialize Neon database:', err.message);
  process.exit(1);
}
