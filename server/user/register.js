const jwt = require('jsonwebtoken')
const db = require('../database')
const { encrypt } = require('./encrypt')

const register = async (req, res) => {
  var name = req.body.name
  var email = req.body.email
  var password = req.body.password

  if (!email) {
    return res.status(400).send({ message: 'email is missing' })
  }
  if (!password) {
    return res.status(400).send({ message: 'password is missing' })
  }

  const userExists = false
  if (userExists) {
    res.status(409).send({ success: false, message: 'email already in use' })
  } else {
    const passwordHash = await encrypt(password)

    db.pool
      .query(`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)`, [name, email, passwordHash])
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
        })
      })
      .catch((err) => {
        if (err?.constraint == 'users_email_key') {
          res.status(400).send({ message: 'Email already exists' })
          return
        }
        res.status(400).send({ err: err })
      })
  }
}
exports.register = register
