const jwt = require('jsonwebtoken')
const db = require('../database')
const { encrypt } = require('./encrypt')

const Joi = require('joi')

const schema = Joi.object({
  username: Joi.string().alphanum().min(5).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
})

const register = async (req, res) => {
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

  db.pool
    .query(`INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)`, [username, email, passwordHash])
    .then((hey) => {
      console.log('hey: ', hey.rows)
      //use the payload to store information about the user such as email, user role, etc.
      let payload = { email: email }

      //create the access token with the shorter lifespan
      let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'no secret', {
        algorithm: 'HS256',
        expiresIn: '30d',
      })

      //send the access token to the client inside a cookie
      res.cookie('jwt', accessToken, { secure: false, httpOnly: true })
      res.send({
        email,
        username: username,
        email_verified: false,
      })
    })
    .catch((err) => {
      if (err?.constraint == 'users_email_key') {
        res.status(400).send({ error: 'Email already exists' })
        return
      }
      if (err?.constraint == 'users_username_key') {
        res.status(400).send({ error: 'Username already exists' })
        return
      }
      res.status(400).send({ error: err })
    })
}
exports.register = register
