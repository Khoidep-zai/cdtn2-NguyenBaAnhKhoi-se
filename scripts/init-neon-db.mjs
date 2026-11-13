import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

async function initDb() {
  console.log('Connecting to Neon via Pool for schema initialization...');
  const client = await pool.connect();
  try {
    const schemaSql = fs.readFileSync(path.resolve('database/schema.sql'), 'utf-8');
    console.log('Executing database/schema.sql on Neon...');
    await client.query(schemaSql);
    console.log('Schema tables created successfully!');

    const seedSql = fs.readFileSync(path.resolve('database/seed.sql'), 'utf-8');
    console.log('Executing database/seed.sql on Neon...');
    await client.query(seedSql);
    console.log('Seed data inserted successfully!');

    const res = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name;
    `);
    console.log('Tables present in Neon database:', res.rows.map(r => r.table_name));

    const userCount = await client.query('SELECT COUNT(*) FROM users;');
    const jobCount = await client.query('SELECT COUNT(*) FROM jobs;');
    console.log(`Current stats: Users=${userCount.rows[0].count}, Jobs=${jobCount.rows[0].count}`);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
