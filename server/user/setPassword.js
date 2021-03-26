const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../database')
const { encrypt } = require('./encrypt')

const setPassword = async (req, res) => {
  var email = req.body.email
  var token = req.body.token
  var password = req.body.password

  if (!email) {
    return res.status(400).send({ message: 'email is missing' })
  }
  // if (!password) {
  //   return res.status(400).send({ message: "password is missing" });
  // }

  const userValue = (await db.pool.query('SELECT * FROM users WHERE email = $1', [email]))?.rows?.[0]
  if (!userValue) {
    res.status(401).send({ message: 'email not found' })
    return
  }

  const result = await new Promise((resolve) => {
    bcrypt.compare(token, userValue.token_hash, function (err, result) {
      resolve(result)
    })
  })
  if (!result) {
    res.status(401).send({  message: 'wrong token' })
    return
  }

  const passwordHash = await encrypt(password)
  console.log('passwordHash: ', passwordHash)

  db.pool
    .query(`UPDATE users SET password_hash=$1, token_hash=NULL, email_verified=TRUE WHERE email=$2`, [
      passwordHash,
      email,
    ])
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
      res.status(400).send({ error: err })
    })
}
exports.setPassword = setPassword
