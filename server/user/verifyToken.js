const bcrypt = require('bcrypt')
const db = require('../database')

const verifyToken = async (req, res) => {
  var email = req.body.email
  var token = req.body.token

  if (!email) {
    return res.status(400).send({ message: 'email is missing' })
  }

  const userValue = (await db.pool.query('SELECT * FROM users WHERE email = $1', [email]))?.rows?.[0]
  if (!userValue) {
    res.status(401).send({ success: false, message: 'email not found' })
    return
  }

  const result = await new Promise((resolve) => {
    bcrypt.compare(token, userValue.token_hash, function (err, result) {
      resolve(result)
    })
  })
  if (!result) {
    res.status(401).send({ success: false, message: 'wrong token' })
    return
  }

  res.send({
    success: true,
  })
}
exports.verifyToken = verifyToken
