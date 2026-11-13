import dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED);

async function main() {
  console.log('Testing connection to Neon PostgreSQL using @neondatabase/serverless...');
  console.log('Target Branch:', process.env.NEON_BRANCH);
  const result = await sql`SELECT version(), current_database(), current_user;`;
  console.log('Neon Database Query Result:', result);
}

main().catch(err => {
  console.error('Neon Connection Error:', err);
  process.exit(1);
});

