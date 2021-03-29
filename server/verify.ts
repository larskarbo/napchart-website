const jwt = require('jsonwebtoken')
const db = require('./database')


export const verify = (type: 'optional' | 'normal' | 'no-email-check') =>
  function (req, res, next) {
    let accessToken = req.cookies.jwt

    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken) {
      if (type == 'optional') {
        return next()
      }
      return res.status(403).send({ message: 'No access token present' })
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
          if (user.email_verified || type == 'no-email-check') {
            req.user = user
            next()
            return
          } else {
            if(type == 'optional'){
              return next()
            }
            return res.status(401).send({
              message: "Email is not verified"
            })
            
          }
          return
        }
        return res.status(401).send()
      })
    } catch (e) {
      console.log(e)
      //if an error occured return request unauthorized error
      return res.status(401).send()
    }
  }
