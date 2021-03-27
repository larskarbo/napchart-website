const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../database')
const publicUserObject = require('../utils/publicUserObject')

export const login = async (req, res) => {
  var email = req.body.email
  var password = req.body.password
  const userValue = (await db.pool.query('SELECT * FROM users WHERE email = $1', [email]))?.rows?.[0]
  if (!userValue) {
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

  //use the payload to store information about the user such as email, user role, etc.
  let payload = { email: email }

  //create the access token with the shorter lifespan
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'no secret', {
    algorithm: 'HS256',
    expiresIn: '30d',
  })

  //send the access token to the client inside a cookie
  res.cookie('jwt', accessToken, { secure: false, httpOnly: true })
  res.send(publicUserObject(userValue))
}
