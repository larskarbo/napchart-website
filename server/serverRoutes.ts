// middleware imports
import { discourseHandler } from './discourse/connect'
import { createSnapshot } from './charts/createSnapshot'
import { publicUserObject } from './utils/publicUserObject'
import { verify } from './verify'
import { login } from './user/login'
import { logout } from './user/logout'
import { register } from './user/register'
import { setPassword } from './user/setPassword'
import { verifyPasswordResetToken } from './user/verifyPasswordResetToken'
import { createChart } from './charts/createChart'
import { updateChart } from './charts/updateChart'
import { getChart } from './charts/getChart'
import { getChartsFromUser } from './charts/getChartsFromUser'
import { pool } from './database'

import express from 'express'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import rateLimit from 'express-rate-limit'
import { sendPasswordResetTokenEndpoint } from './user/sendPasswordResetToken'
import { deleteChart } from './charts/deleteChart';
import { verifyEmail } from './user/verifyEmail';
import { sendEmailVerifyTokenEndpoint } from './user/sendEmailVerifyToken';

const app = express()

var cors = require('cors')
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:8000',
      'http://localhost:8888',
      'http://horse.loc:8000',
      'http://horse.loc:8888',
      'https://napchart.com',
      /napchart.netlify.app$/,
    ],
  }),
)

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(cookieParser())

app.get('/', async (req, res) => {
  res.send({ status: 'Ok' })
})

app.get('/users', verify("normal"), async (req, res) => {
  pool.query('SELECT * FROM users').then((hey) => {
    res.send({ users: hey.rows })
  })
})

app.get('/testAuth', verify("normal"), async (req, res) => {
  res.send({ success: true })
})

// user
app.get('/getUser', verify("no-email-check"), async (req, res) => {
  res.send(publicUserObject(req.user))
})

const mailRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
})

const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
})

const createRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
})

app.post('/login', loginRateLimiter, login)
app.get('/logout', logout)
app.post('/register', mailRateLimiter, register)

app.post('/sendPasswordResetToken', mailRateLimiter, sendPasswordResetTokenEndpoint)
app.post('/verifyPasswordResetToken', verifyPasswordResetToken)
app.post('/setPassword', setPassword)

app.post('/sendEmailVerifyToken', mailRateLimiter, verify("no-email-check"), sendEmailVerifyTokenEndpoint)
app.post('/verifyEmail', loginRateLimiter, verifyEmail)


app.post('/createSnapshot', createRateLimiter, verify("optional"), createSnapshot)
app.get('/getChart/:chartid', getChart)
app.post('/createChart', createRateLimiter, verify("normal"), createChart)
app.post('/updateChart/:chartid', verify("normal"), updateChart)
app.delete('/deleteChart/:chartid', verify("normal"), deleteChart)
app.get('/getChartsFromUser/:username', getChartsFromUser)

// public API
app.post('/v1/createSnapshot', createRateLimiter, verify("optional"), createSnapshot)
app.get('/v1/getChart/:chartid', getChart)


app.get('/discourse-connect', verify("normal"), discourseHandler)

app.all('/*', (req, res) => {
  return res.status(404).send({
    message: 'Route not found',
  })
})

export default app
