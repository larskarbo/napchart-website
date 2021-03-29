import { pool } from '../database'

export const verifyEmail = async (req, res) => {
  var utoken = req.body.utoken

  const userToken = (await pool.query('SELECT * FROM user_tokens WHERE token = $1', [utoken]))?.rows?.[0]
  console.log('userToken: ', userToken)
  if (!userToken) {
    res.status(401).send({ message: 'Invalid token' })
    return
  }

  const userValue = (await pool.query('SELECT * FROM users WHERE id = $1', [userToken.user_id]))?.rows?.[0]
  console.log('userValue: ', userValue);
  if (!userValue) {
    res.status(401).send({ message: 'user not found' })
    return
  }

  pool
    .query(`UPDATE users SET email_verified=TRUE WHERE id=$1`, [userValue.id])
    .then((hey) => {
      if(hey.rowCount > 0){
        res.send({
          sucess: true,
        })
      } else {
        res.status(500).send({ message: "Error in the DB" })
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err })
    })
}
