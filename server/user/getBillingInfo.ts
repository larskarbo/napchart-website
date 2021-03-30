import { pool } from '../database'


export const getBillingInfo = async function (req, res) {

  const user = req.user

  pool.query('SELECT * FROM billing WHERE id = $1', [user.id], (error, results) => {
    if (error) {
      throw error
    }
    
    console.log('results: ', results);
    res.send(results.rows[0])
  })
}
