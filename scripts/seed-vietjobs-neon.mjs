import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL or DATABASE_URL_UNPOOLED is required.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

// Robust SQL statement parser handling quotes, dollar tags, and comments
function parseSqlStatements(content) {
  const statements = [];
  let current = '';
  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const next = content[i + 1] || '';

    // Handle comments outside strings
    if (!inString) {
      if (!inLineComment && !inBlockComment) {
        if (c === '-' && next === '-') {
          inLineComment = true;
          i++;
          continue;
        }
        if (c === '/' && next === '*') {
          inBlockComment = true;
          i++;
          continue;
        }
      } else if (inLineComment) {
        if (c === '\n') {
          inLineComment = false;
        }
        continue;
      } else if (inBlockComment) {
        if (c === '*' && next === '/') {
          inBlockComment = false;
          i++;
        }
        continue;
      }
    }

    // Handle strings
    if (c === "'" && !inLineComment && !inBlockComment) {
      if (inString && next === "'") {
        current += "''";
        i++;
        continue;
      }
      inString = !inString;
    }

    current += c;

    // Statement terminator
    if (c === ';' && !inString && !inLineComment && !inBlockComment) {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      current = '';
    }
  }

  const remainder = current.trim();
  if (remainder.length > 0) {
    statements.push(remainder);
  }

  return statements;
}

async function seedDatabase() {
  console.log('>>> STARTING FULL VIETJOBS SEEDING ON NEON POSTGRESQL <<<');
  const client = await pool.connect();

  try {
    // 1. Ensure Schema
    console.log('[1/6] Ensuring full schema from database/schema.sql...');
    const schemaSql = fs.readFileSync(path.resolve('database/schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('      Schema tables and indexes verified.');

    // 2. Parse postgres_init.sql
    console.log('[2/6] Parsing database/postgres_init.sql...');
    const initContent = fs.readFileSync(path.resolve('database/postgres_init.sql'), 'utf-8');
    const allStmts = parseSqlStatements(initContent);
    console.log(`      Total statements parsed: ${allStmts.length}`);

    const roleStmts = allStmts.filter(s => s.startsWith('INSERT INTO roles'));
    const catStmts = allStmts.filter(s => s.startsWith('INSERT INTO categories'));
    const userStmts = allStmts.filter(s => s.startsWith('INSERT INTO users'));
    const jobStmts = allStmts.filter(s => s.startsWith('INSERT INTO jobs'));

    console.log(`      Found: Roles=${roleStmts.length}, Categories=${catStmts.length}, Users=${userStmts.length}, Jobs=${jobStmts.length}`);

    // 3. Clear existing demo child data to ensure clean foreign key updates
    console.log('[3/6] Cleaning up test data & resetting categories/jobs...');
    await client.query(`
      DELETE FROM notifications;
      DELETE FROM reviews;
      DELETE FROM applications;
      DELETE FROM reports;
      DELETE FROM jobs;
      DELETE FROM categories;
    `);
    console.log('      Old jobs and categories cleared.');

    // 4. Insert Roles, 16 Standard Categories, and Users
    console.log('[4/6] Inserting Roles, Categories (16), and Employers/Users...');
    
    // Roles (safe on conflict)
    await client.query(`
      INSERT INTO roles (id, name, description) VALUES
      (1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
      (2, 'ROLE_EMPLOYER', 'Nhà tuyển dụng / Doanh nghiệp / Cá nhân thuê nhân sự'),
      (3, 'ROLE_STUDENT', 'Sinh viên tìm việc part-time hoặc freelance')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Categories (16 standard)
    for (const c of catStmts) {
      await client.query(c);
    }

    // Users from postgres_init.sql
    for (const u of userStmts) {
      const cleanStmt = u.trim().replace(/;\s*$/, '');
      await client.query(cleanStmt + ' ON CONFLICT (id) DO UPDATE SET email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, full_name=EXCLUDED.full_name;');
    }

    // Demo Accounts with test.com for universal login
    await client.query(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role_id, company_name, bio, skills, is_active)
      VALUES 
        (11, 'admin@test.com', '$2a$10$C1hSAVkq0Gi9/oHZyvY6E.lYxnQiF1/kM9xzSIdWcadOqurdRD9tC', 'Admin System Demo', '0909999001', 1, 'FreelanceHub System', 'Tài khoản admin mẫu', 'Admin, Security', true),
        (12, 'employer@test.com', '$2a$10$C1hSAVkq0Gi9/oHZyvY6E.lYxnQiF1/kM9xzSIdWcadOqurdRD9tC', 'Employer Demo', '0909999002', 2, 'TopCV Partner Corp', 'Tài khoản nhà tuyển dụng mẫu', 'Recruitment, HR', true),
        (13, 'student@test.com', '$2a$10$C1hSAVkq0Gi9/oHZyvY6E.lYxnQiF1/kM9xzSIdWcadOqurdRD9tC', 'Student Demo', '0909999003', 3, NULL, 'Tài khoản sinh viên mẫu', 'Java, React, Design', true)
      ON CONFLICT (id) DO UPDATE SET email=EXCLUDED.email, password_hash=EXCLUDED.password_hash;
    `);
    console.log('      Users and demo accounts (admin@test.com, employer@test.com, student@test.com) seeded.');

    // 5. Insert all 1,470 Jobs in Batches of 50
    console.log(`[5/6] Inserting ${jobStmts.length} VietJobs records in batches...`);
    const BATCH_SIZE = 50;
    let insertedCount = 0;

    for (let i = 0; i < jobStmts.length; i += BATCH_SIZE) {
      const batch = jobStmts.slice(i, i + BATCH_SIZE);
      const batchSql = batch.join('\n');
      await client.query(batchSql);
      insertedCount += batch.length;
      if (insertedCount % 200 === 0 || insertedCount === jobStmts.length) {
        console.log(`      Progress: ${insertedCount}/${jobStmts.length} jobs inserted...`);
      }
    }

    // 6. Reset Sequences and Verify Statistics
    console.log('[6/6] Resetting sequences and verifying database integrity...');
    await client.query(`
      SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));
      SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
      SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
      SELECT setval('jobs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM jobs));
    `);

    // Add 2 initial demo applications so application testing works out-of-the-box
    await client.query(`
      INSERT INTO applications (id, job_id, student_id, cover_letter, cv_url, status)
      VALUES 
        (1, 1, 4, 'Em rất mong muốn được ứng tuyển vị trí này để tích lũy kinh nghiệm.', 'https://example.com/cv/tai.pdf', 'PENDING'),
        (2, 2, 5, 'Em có kinh nghiệm 1 năm làm việc với React và TailwindCSS.', 'https://example.com/cv/khoi.pdf', 'ACCEPTED')
      ON CONFLICT (id) DO NOTHING;
      SELECT setval('applications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM applications));
    `);

    // Verification queries
    const totalJobs = await client.query('SELECT COUNT(*) FROM jobs;');
    const totalCategories = await client.query('SELECT COUNT(*) FROM categories;');
    const totalUsers = await client.query('SELECT COUNT(*) FROM users;');

    console.log('\n================ SEEDING COMPLETED SUCCESSFULLY ================');
    console.log(` Total Jobs:       ${totalJobs.rows[0].count}`);
    console.log(` Total Categories: ${totalCategories.rows[0].count}`);
    console.log(` Total Users:      ${totalUsers.rows[0].count}`);

    const catStats = await client.query(`
      SELECT c.id, c.name, COUNT(j.id) AS job_count 
      FROM categories c 
      LEFT JOIN jobs j ON j.category_id = c.id 
      GROUP BY c.id, c.name 
      ORDER BY c.id;
    `);
    console.log('\nJobs breakdown by 16 standard categories:');
    console.table(catStats.rows);

  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
