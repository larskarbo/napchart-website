const { Pool } = require('pg')

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

export const queryOne = async (...props) => {
  return (await pool.query(...props))?.rows?.[0]
}