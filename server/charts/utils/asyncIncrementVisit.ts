import { pool } from '../../database'

export const asyncIncrementVisit = (chartid) =>
  pool.query('UPDATE charts set visits = visits + 1, last_visit = now() WHERE chartid = $1', [chartid])
