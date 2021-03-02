const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../database')

const login = async (req, res) => {
  var email = req.body.email
  var password = req.body.password
  const userValue = (await db.pool.query('SELECT * FROM users WHERE email = $1', [email]))?.rows?.[0]
  if (!userValue) {
    res.status(401).send({ success: false, message: 'email not found' })
    return
  }

  const result = await new Promise((resolve) => {
    console.log('userValue.password_hash: ', userValue.password_hash)
    bcrypt.compare(password, userValue.password_hash, function (err, result) {
      resolve(result)
    })
  })
  if (!result) {
    res.status(401).send({ success: false, message: 'wrong password' })
    return
  }

  //use the payload to store information about the user such as email, user role, etc.
  let payload = { email: email }

  //create the access token with the shorter lifespan
  console.log('🚀 ~ payload', payload)
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'no secret', {
    algorithm: 'HS256',
    expiresIn: '30d',
  })

  //send the access token to the client inside a cookie
  res.cookie('jwt', accessToken, { secure: false, httpOnly: true })
  res.send({
    email,
    role: userValue.role,
  })
}
exports.login = login
