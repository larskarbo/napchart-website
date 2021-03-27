import { requestIp } from 'request-ip'
import { pwSchema, usernameSchema } from './authUtils/userSchema'
import { publicUserObject } from '../utils/publicUserObject'
import { pool } from '../database'
import { encrypt } from './authUtils/encrypt';
const jwt = require('jsonwebtoken')

const Joi = require('joi')
const schema = Joi.object({
  username: usernameSchema,
  password: pwSchema,
  email: Joi.string().email().required(),
})

export const register = async (req, res) => {
  const validate = schema.validate({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  if (validate.error) {
    const { details } = validate.error
    const message = details.map((i) => i.message).join(',')

    return res.status(422).json({ error: message })
  }

  const { username, email, password } = validate.value

  const passwordHash = await encrypt(password)

  pool
    .query(`INSERT INTO users (username, email, password_hash, ip) VALUES ($1, $2, $3, $4) RETURNING *`, [
      username,
      email,
      passwordHash,
      requestIp.getClientIp(req),
    ])
    .then((hey) => {
      //use the payload to store information about the user such as email, user role, etc.
      let payload = { email: email }

      //create the access token with the shorter lifespan
      let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'no secret', {
        algorithm: 'HS256',
        expiresIn: '30d',
      })

      //send the access token to the client inside a cookie
      res.cookie('jwt', accessToken, { secure: false, httpOnly: true })
      res.send(publicUserObject(hey.rows[0]))
    })
    .catch((err) => {
      if (err?.constraint == 'users_email_key') {
        res.status(400).send({ message: 'Email already exists' })
        return
      }
      if (err?.constraint == 'users_username_key') {
        res.status(400).send({ message: 'Username already exists' })
        return
      }
      res.status(400).send({ message: err.message })
    })
}
