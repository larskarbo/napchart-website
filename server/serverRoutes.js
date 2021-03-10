const express = require('express')
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
var multer = require('multer')
var path = require('path')
const mkdirp = require('mkdirp')
mkdirp(path.join(__dirname, 'uploads'))
var fs = require('fs')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  },
})

var upload = multer({ storage: storage })

var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(cookieParser())

// middleware imports
const { verify } = require('./verify')
const { optionalVerify } = require('./optionalVerify')

// routes imports
const { login } = require('./user/login')
const { logout } = require('./user/logout')
const { register } = require('./user/register')

const db = require('./database')
const { registerWithToken } = require('./user/registerWithToken')
const { setPassword } = require('./user/setPassword')
const { verifyToken } = require('./user/verifyToken')
const { createChart } = require('./charts/createChart')
const { updateChart } = require('./charts/updateChart')
const { getChart } = require('./charts/getChart')
const { getChartsFromUser } = require('./charts/getChartsFromUser')
const publicUserObject = require('./utils/publicUserObject')

app.get('/', async (req, res) => {
  res.send({ status: 'Ok' })
})

app.get('/users', verify, async (req, res) => {
  db.pool.query('SELECT * FROM users').then((hey) => {
    res.send({ users: hey.rows })
  })
})

app.get('/testAuth', verify, async (req, res) => {
  res.send({ success: true })
})

// user
app.get('/getUser', verify, async (req, res) => {
  res.send(publicUserObject(req.user))
})

app.post('/login', login)
app.get('/logout', logout)
app.post('/register', register)
app.post('/registerWithToken', registerWithToken)
app.post('/setPassword', setPassword)
app.post('/verifyToken', verifyToken)

app.post('/createChart', optionalVerify, createChart)
app.post('/updateChart/:chartid', verify, updateChart)
app.get('/getChart/:chartid', getChart)
app.get('/getChartsFromUser/:username', getChartsFromUser)

app.get('/discourse-connect', verify, require('./discourse/connect'))

app.all('/*', (req, res) => {
  return res.status(404).send({
    status: 'Not found',
  })
})

module.exports = app
