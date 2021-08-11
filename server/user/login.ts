import bcrypt from 'bcrypt'
import { pool } from '../database'
import { injectAccessTokenCookie } from './authUtils/injectAccessTokenCookie'

export const login = async (req, res) => {
  var email = req.body.email
  var password = req.body.password
  const userValue = (await pool.query('SELECT * FROM users WHERE email = $1', [email]))?.rows?.[0]
  if (!userValue) {
    console.log('email: ', email)
    res.status(401).send({ message: 'email not found' })
    return
  }

  const result = await new Promise((resolve) => {
    bcrypt.compare(password, userValue.password_hash, function (err, result) {
      resolve(result)
    })
  })

  if (!result) {
    res.status(401).send({ message: 'wrong password' })
    return
  }

  injectAccessTokenCookie(res, email)

  res.send(userValue)
}
