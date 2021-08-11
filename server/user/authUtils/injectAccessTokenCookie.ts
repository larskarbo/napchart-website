import jwt from 'jsonwebtoken'

export function injectAccessTokenCookie(res: any, email: string) {
  //use the payload to store information about the user such as email, user role, etc.
  let payload = { email: email }

  //create the access token with the shorter lifespan
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'no secret', {
    algorithm: 'HS256',
    expiresIn: '30d',
  })

  //send the access token to the client inside a cookie
  res.cookie('jwt', accessToken, { secure: false, httpOnly: true })
}
