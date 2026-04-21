const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.POSTGRES_DB || 'helpdesk',
  user: process.env.POSTGRES_USER || 'helpdesk_user',
  password: process.env.POSTGRES_PASSWORD || 'helpdesk_password'
});

module.exports = pool;
