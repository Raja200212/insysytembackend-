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

async function ensureTableColumns(conn) {
  const dbName = process.env.DB_NAME;
  if (!dbName) return;

  const tableColumnDefs = {
    products: [
      { name: 'subcategory_id', def: 'INT NULL' },
      { name: 'brand', def: 'VARCHAR(100) NULL' },
      { name: 'description', def: 'TEXT NULL' },
      { name: 'price', def: 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00' },
      { name: 'sale_price', def: 'DECIMAL(10, 2) NULL' },
      { name: 'stock', def: 'INT NOT NULL DEFAULT 0' },
      { name: 'image', def: 'VARCHAR(255) NULL' },
      { name: 'is_featured', def: 'TINYINT(1) DEFAULT 0' },
      { name: 'is_deal', def: 'TINYINT(1) DEFAULT 0' },
      { name: 'rating', def: 'DECIMAL(3, 2) DEFAULT 5.00' },
      { name: 'status', def: "ENUM('active', 'inactive') DEFAULT 'active'" },
      { name: 'updated_at', def: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ],
    users: [
      { name: 'is_admin', def: 'TINYINT(1) DEFAULT 0' },
      { name: 'phone', def: 'VARCHAR(50) NULL' },
      { name: 'address', def: 'TEXT NULL' },
      { name: 'updated_at', def: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ],
    categories: [
      { name: 'description', def: 'TEXT NULL' },
      { name: 'image', def: 'VARCHAR(255) NULL' },
      { name: 'status', def: "ENUM('active', 'inactive') DEFAULT 'active'" }
    ],
    subcategories: [
      { name: 'description', def: 'TEXT NULL' },
      { name: 'image', def: 'VARCHAR(255) NULL' },
      { name: 'status', def: "ENUM('active', 'inactive') DEFAULT 'active'" }
    ]
  };

  for (const [table, columns] of Object.entries(tableColumnDefs)) {
    try {
      const [existingCols] = await conn.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [dbName, table]
      );
      if (!existingCols || existingCols.length === 0) continue;

      const colNames = new Set(existingCols.map(c => c.COLUMN_NAME.toLowerCase()));

      for (const col of columns) {
        if (!colNames.has(col.name.toLowerCase())) {
          console.log(`[Database Migration] Adding missing column '${col.name}' to table '${table}'...`);
          await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col.name}\` ${col.def}`);
        }
      }
    } catch (err) {
      console.warn(`[Database Migration Warning] Failed checking/adding columns for ${table}:`, err.message);
    }
  }
}

async function initDb() {
  let conn;

  try {
    conn = await pool.getConnection();

    console.log(
      `[Database] Connected successfully to MySQL database: "${process.env.DB_NAME}"`
    );

    // Auto-migrate missing columns for existing tables
    await ensureTableColumns(conn);

    // Optional: run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');

      if (sql.trim()) {
        await conn.query(sql);
        console.log('[Database] Tables & seed data initialized successfully.');
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