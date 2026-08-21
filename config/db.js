const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

async function initDb() {
  let conn;

  try {
    conn = await pool.getConnection();

    console.log(
      `[Database] Connected successfully to MySQL database: "${process.env.DB_NAME}"`
    );

    // Optional: run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');

      if (sql.trim()) {
        await conn.query(sql);
        console.log('[Database] Tables initialized successfully.');
      }
    }

  } catch (error) {
    console.error(
      '[Database Error]',
      error.message
    );
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

module.exports = {
  pool,
  initDb
};