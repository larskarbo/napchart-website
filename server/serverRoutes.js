const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors({ credentials: true, origin: ['http://localhost:8000', 'http://localhost:8888', 'https://napchart.com'] }))
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

// routes imports
const { login } = require('./user/login')
const { logout } = require('./user/logout')
const { register } = require('./user/register')

const db = require('./database')
const { registerWithToken } = require('./user/registerWithToken')
const { setPassword } = require('./user/setPassword')
const { verifyToken } = require('./user/verifyToken')

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
  res.send({
    name: req.user.name,
    email: req.user.email,
    email_verified: req.user.email_verified,
  })
})

app.get('/progress/:courseId', verify, async (req, res) => {
  const progressArr = (
    await db.pool.query('SELECT item_id, progress FROM progress WHERE user_id = $1 and course_id = $2', [
      req.user.id,
      req.params.courseId,
    ])
  )?.rows

  const progress = {}
  progressArr.forEach(({ item_id, progress: p }) => (progress[item_id] = p))

  return res.send(progress)
})

app.post('/setProgress/:courseId', verify, async (req, res) => {
  const progress = req.body.progress
  const key = req.body.key

  if (!progress || !(progress >= 0 && progress <= 100)) {
    return res.status(400).send({ message: 'progress is missing' })
  }

  await db.pool.query(
    `
  INSERT INTO progress (user_id, course_id, item_id, progress)
  VALUES ($1, $2, $3, $4)
   ON CONFLICT (user_id, course_id, item_id) 
   DO 
    UPDATE SET progress = EXCLUDED.progress;
  `,
    [req.user.id, req.params.courseId, key, progress],
  )

  return res.send({ progress })
})

app.post('/uploadRecording/:courseId/:itemId', verify, upload.single('recording'), function (req, res, next) {
  console.log('req.file: ', req.file)

  db.pool
    .query('INSERT INTO recordings (course_id, item_id, file_id, user_id) VALUES ($1, $2, $3, $4) RETURNING file_id', [
      req.params.courseId,
      req.params.itemId,
      req.file.path,
      req.user.id,
    ])
    .then((hey) => {
      console.log('hey: ', hey)
      res.send({
        message: 'wihu',
        fileId: hey.rows[0].file_id,
      })
    })

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.post('/deleteRecording/:courseId/:itemId', verify, upload.single('recording'), function (req, res, next) {
  if (!req.body.file_id) {
    return res.status(400).send({ message: 'file_id is missing' })
  }

  db.pool
    .query(
      'DELETE from recordings where course_id = $1 and item_id = $2 and user_id = $3 and file_id = $4 RETURNING file_id',
      [req.params.courseId, req.params.itemId, req.user.id, req.body.file_id],
    )
    .then((hey) => {
      if (hey.rows.length == 0) {
        res.send({
          message: 'already gone!',
        })
      } else {
        fs.unlink(path.join(__dirname, hey.rows[0].file_id), () => {
          res.send({
            message: 'deleted it!',
          })
        })
      }
    })

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.get('/getRecordings/:courseId/:itemId', verify, upload.single('recording'), function (req, res) {
  db.pool
    .query('SELECT file_id FROM recordings WHERE course_id = $1 and item_id = $2 and user_id = $3', [
      req.params.courseId,
      req.params.itemId,
      req.user.id,
    ])
    .then((hey) => {
      res.send({
        message: 'wihu',
        files: hey.rows,
      })
    })

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.post('/login', login)
app.get('/logout', logout)
app.post('/register', register)
app.post('/registerWithToken', registerWithToken)
app.post('/setPassword', setPassword)
app.post('/verifyToken', verifyToken)

app.all('/*', (req, res) => {
  return res.status(404).send({
    status: 'Not found',
  })
})

module.exports = app
