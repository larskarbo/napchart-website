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
import { getImage } from './charts/getImage'
import { updateChart } from './charts/updateChart'
import { slackNotify } from './charts/utils/slackNotify'
import { checkout } from './money/checkout'
import { customerPortal } from './money/customer-portal'
import { stripeWebhook } from './money/stripe-webhook'
import { getPrisma } from './src/utils/prisma'
import { login } from './user/login'
import { logout } from './user/logout'
import { register } from './user/register'
import { sendEmailVerifyTokenEndpoint } from './user/sendEmailVerifyToken'
import { sendPasswordResetTokenEndpoint } from './user/sendPasswordResetToken'
import { setPassword } from './user/setPassword'
import { verify } from './user/verify'
import { verifyEmail } from './user/verifyEmail'
import { verifyPasswordResetToken } from './user/verifyPasswordResetToken'

const app = express()

var cors = require('cors')
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://horse.loc:3000', 'https://napchart.com', /larskarbo-team\.vercel\.app/],
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

const prisma = getPrisma()

app.get('/users', verify('normal'), async (req, res) => {
  const users = await prisma.user.findMany()
  res.send({ users })
})

app.get('/getUsers', async (req, res) => {
  const users = await prisma.user.findMany({ select: { username: true } })
  res.send({ users })
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
  max: 20,
})

const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
})

const createRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
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
app.get('/v1/getImage/:chartid', verify('optional'), getImage)

app.post('/reportError', (req, res) => {
  slackNotify(req.body.text, req.body.obj)
  res.send({ ok: 'ok' })
})

app.all('/*', (req, res) => {
  return res.status(404).send({
    message: 'Route not found',
  })
})

export default app
