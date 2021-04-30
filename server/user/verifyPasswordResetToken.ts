import { pool } from '../database'

export const verifyPasswordResetToken = async (req, res) => {
  var utoken = req.body.utoken

  const userToken = (await pool.query('SELECT * FROM user_tokens WHERE token = $1', [utoken]))?.rows?.[0]
  console.log('userToken: ', userToken)
  if (!userToken || userToken.token_type != "password-reset") {
    res.status(401).send({ message: 'invalid token' })
    return
  }

  const userValue = (await pool.query('SELECT * FROM users WHERE id = $1', [userToken.user_id]))?.rows?.[0]
  console.log('userValue: ', userValue)
  if (!userValue) {
    res.status(401).send({ message: 'email not found' })
    return
  }

  res.send({
    email: userValue.email,
  })
}
