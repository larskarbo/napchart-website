// middleware imports
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { createChart } from './charts/createChart'
import { createSnapshot } from './charts/createSnapshot'
import { deleteChart } from './charts/deleteChart'
import { getChart } from './charts/getChart'
import { getChartsFromUser } from './charts/getChartsFromUser'
import { updateChart } from './charts/updateChart'
import { slackNotify } from './charts/utils/slackNotify'
import { pool } from './database'
import { discourseHandler } from './discourse/connect'
import { checkout } from './money/checkout'
import { customerPortal } from './money/customer-portal'
import { stripeWebhook } from './money/stripe-webhook'
import { login } from './user/login'
import { logout } from './user/logout'
import { register } from './user/register'
import { sendEmailVerifyTokenEndpoint } from './user/sendEmailVerifyToken'
import { sendPasswordResetTokenEndpoint } from './user/sendPasswordResetToken'
import { setPassword } from './user/setPassword'
import { verifyEmail } from './user/verifyEmail'
import { verifyPasswordResetToken } from './user/verifyPasswordResetToken'
import { verify } from './verify'

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

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  }),
)
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(cookieParser())

app.get('/', async (req, res) => {
  res.send({ status: 'Ok' })
})

app.get('/users', verify('normal'), async (req, res) => {
  pool.query('SELECT * FROM users').then((hey) => {
    res.send({ users: hey.rows })
  })
})

app.get('/testAuth', verify('normal'), async (req, res) => {
  res.send({ success: true })
})

// user
app.get('/getUser', verify('no-email-check'), async (req, res) => {
  res.send(req.user)
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

app.post('/sendEmailVerifyToken', mailRateLimiter, verify('no-email-check'), sendEmailVerifyTokenEndpoint)
app.post('/verifyEmail', loginRateLimiter, verifyEmail)

app.post('/createSnapshot', createRateLimiter, verify('optional'), createSnapshot)
app.get('/getChart/:chartid', getChart)
app.post('/createChart', createRateLimiter, verify('normal'), createChart)
app.post('/updateChart/:chartid', verify('normal'), updateChart)
app.delete('/deleteChart/:chartid', verify('normal'), deleteChart)
app.get('/getChartsFromUser/:username', verify('optional'), getChartsFromUser)

// money
app.post('/money/customer-portal/:stripeCustomerId', verify('no-email-check'), customerPortal)
app.post('/money/checkout', verify('optional'), checkout)
app.post('/money/stripe-webhook', stripeWebhook)

// public API
app.post('/v1/createSnapshot', createRateLimiter, verify('optional'), createSnapshot)
app.get('/v1/getChart/:chartid', verify('optional'), getChart)

app.get('/discourse-connect', verify('normal'), discourseHandler)

app.post("/reportError", (req, res) => {
  slackNotify(req.body.text, req.body.obj)
  res.send({ok: "ok"})
})

app.all('/*', (req, res) => {
  return res.status(404).send({
    message: 'Route not found',
  })
})

export default app
