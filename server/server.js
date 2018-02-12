var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var database = require('./database/database')
var nunjucks = require('nunjucks')

var api = require('./api/api')

var auth = require('./auth/auth')
var passport = require('./auth/passport')

// ENVIRONMENTAL:
require('dotenv').config()
process.env.URL = process.env.URL || 'https://napchart.com/'

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: database.connection,
    ttl: 3 * 31 * 24 * 60 * 60 // three months
  })
}))

app.use(passport.initialize());
app.use(passport.authenticate('session'));

// <PRODUCTION>
if (process.env.NODE_ENV == 'production') {
  console.log('Starting node server in production mode')
  app.get('*.js', function (req, res, next) {
    console.log('fj')
    req.url = req.url + '.gz'
    res.set('Content-Encoding', 'gzip')
    next()
  })
}
// </PRODUCTION>

app.use('/public', express.static(path.resolve(__dirname + '/../dist')))
app.use('/public', express.static(path.resolve(__dirname + '/../public')))
app.use(express.static(path.resolve(__dirname + '/../favicon/generated')))

var env = {
  siteUrl: process.env.URL
}

app.get(['/signup', '/login'], function (req, res, next) {
  if (req.user) {
    return res.redirect('/user/' + req.user.username)
  } else {
    next()
  }
})
console.log(env)
app.get(['/', '/app', '/login', '/user/:username'], function (req, res) {
  console.log('user', req.user)
  var file = nunjucks.render(__dirname + '/../client/index.html', {
    ...env,
    user: req.user
  })
  res.send(file)
})

app.get('/signup', function (req, res) {
  var file = nunjucks.render(__dirname + '/../client/index.html', {
    ...env,
    captcha: true
  })
  res.send(file)
})

app.get('/:whatever', function (req, res) {
  var chartid = req.params.whatever

  database.getChart(chartid, function (err, response) {
    if (err) throw new Error(err)
    if (response == null) {
      return res.status(404).send('404')
    }
    var metaInfo = response.metaInfo || {}
    var title = metaInfo.title || ''
    var description = metaInfo.description || ''
    var file = nunjucks.render(__dirname + '/../client/index.html', {
      ...env,
      data: {
        chartid: chartid,
        title: title.length == 0 ? false : title,
        description: description.length == 0 ? false : description,
        chartAuthor: response.author
      },
      user: req.user
    })

    res.send(file)
  })
})

app.post('/api/create', api.create)
app.post('/api/postFeedback', api.postFeedback)
app.get('/api/get', api.get)
app.get('/api/getImage', api.getImage)

app.post('/auth/signup', auth.signup)
app.post('/auth/login', auth.login)
app.post('/auth/available/:what', auth.available)

var port = process.env.PORT || 3000
app.listen(port, "0.0.0.0", function () {
  console.log(`listening at ${port}`)
})