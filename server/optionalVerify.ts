const jwt = require('jsonwebtoken')
const db = require('./database')

exports.optionalVerify = function (req, res, next) {
  let accessToken = req.cookies.jwt

  //if there is no token stored in cookies, the request is unauthorized
  if (!accessToken) {
    return next()
  }

  let payload
  try {
    //use the jwt.verify method to verify the access token
    //throws an error if the token has expired or has a invalid signature
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'no secret')
    db.pool.query('SELECT * FROM users WHERE email = $1', [payload.email], (error, results) => {
      if (error) {
        throw error
      }
      const user = results.rows[0]

      if (user) {
        req.user = user
        // response.status(200).json(results.rows)
        next()
        return
      }
      return next()
    })
  } catch (e) {
    //if an error occured return request unauthorized error
    return next()
  }
}
