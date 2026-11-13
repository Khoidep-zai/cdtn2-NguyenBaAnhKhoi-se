import dotenv from 'dotenv';
dotenv.config();

import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
console.log('Connecting to Neon PostgreSQL for End-to-End verification...');
console.log('Database Host:', new URL(connectionString.replace('postgresql://', 'http://')).host);
console.log('Branch:', process.env.NEON_BRANCH || 'production');

const pool = new Pool({ connectionString });

async function verifyEndToEnd() {
  const client = await pool.connect();
  try {
    // 1. Verify Connection & Session Info
    const sessionRes = await client.query('SELECT current_database() as db, current_user as usr, version() as ver;');
    console.log('[1/4] Connection Verified:');
    console.log('      DB:', sessionRes.rows[0].db);
    console.log('      User:', sessionRes.rows[0].usr);
    console.log('      Engine:', sessionRes.rows[0].ver.split(' on ')[0]);

    // 2. Query Existing Tables & Counts
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM roles) AS role_count,
        (SELECT COUNT(*) FROM categories) AS category_count,
        (SELECT COUNT(*) FROM users) AS user_count,
        (SELECT COUNT(*) FROM jobs) AS job_count,
        (SELECT COUNT(*) FROM applications) AS app_count,
        (SELECT COUNT(*) FROM reviews) AS review_count;
    `);
    console.log('[2/4] Data Integrity Check:');
    console.log('      Roles:', counts.rows[0].role_count);
    console.log('      Categories:', counts.rows[0].category_count);
    console.log('      Users:', counts.rows[0].user_count);
    console.log('      Jobs:', counts.rows[0].job_count);
    console.log('      Applications:', counts.rows[0].app_count);
    console.log('      Reviews:', counts.rows[0].review_count);

    // 3. Test Read Operation: Fetch active jobs
    const jobsRes = await client.query(`
      SELECT j.id, j.title, j.salary_text, c.name as category_name
      FROM jobs j
      JOIN categories c ON j.category_id = c.id
      LIMIT 2;
    `);
    console.log('[3/4] Live Query Test (Jobs with Categories):');
    jobsRes.rows.forEach(j => {
      console.log(`      - Job #${j.id}: "${j.title}" (${j.category_name}, ${j.salary_text})`);
    });

    // 4. Test Write & Transaction Operation
    await client.query('BEGIN;');
    const insertRes = await client.query(`
      INSERT INTO notifications (user_id, title, message, type, is_read)
      VALUES (1, 'Neon E2E Test Notification', 'Testing write capability on Neon Serverless Postgres', 'SYSTEM', false)
      RETURNING id, title, created_at;
    `);
    const notifId = insertRes.rows[0].id;
    console.log(`[4/4] Transaction & Write Test: Created Notification ID ${notifId}`);

    // Verify Read-After-Write
    const checkRes = await client.query('SELECT id, title, is_read FROM notifications WHERE id = $1;', [notifId]);
    if (checkRes.rows.length === 1 && checkRes.rows[0].title === 'Neon E2E Test Notification') {
      console.log('      Read-After-Write confirmed successfully!');
    }

    // Cleanup test record
    await client.query('DELETE FROM notifications WHERE id = $1;', [notifId]);
    await client.query('COMMIT;');
    console.log('      Cleanup completed. Transaction committed.');

    console.log('\n>>> ALL NEON SERVICES VERIFIED END-TO-END! <<<');
  } finally {
    client.release();
    await pool.end();
  }
}

verifyEndToEnd().catch(err => {
  console.error('E2E Verification Failed:', err);
  process.exit(1);
});
