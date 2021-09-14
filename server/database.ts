import { getEnv } from '@larskarbo/get-env'
import { Pool } from 'pg'

export const pool = new Pool({
  user: getEnv('PGUSER'),
  host: getEnv('PGHOST'),
  database: getEnv('PGDATABASE'),
  password: getEnv('PGPASSWORD'),
  port: getEnv('PGPORT'),
})

export const queryOne = async (...props) => {
  return (await pool.query(...props))?.rows?.[0]
}
