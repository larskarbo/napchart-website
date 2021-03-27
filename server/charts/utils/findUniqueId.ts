import { pool } from '../../database'

const { customAlphabet } = require('nanoid')
const generateRandomId = (n) => customAlphabet('abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789', n)()

export const findUniqueId = async () => {
  const chartid = generateRandomId(4) + ':' + generateRandomId(4) + ':' + generateRandomId(6)
  console.log('chartid: ', chartid)
  return await pool.query(`select exists(select true from charts where chartid=$1)`, [chartid]).then((hey) => {
    if (hey.rows[0].exists) {
      throw new Error('Not unique')
    }
    return chartid
  })
}
