var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var nunjucks = require('nunjucks')

// ENVIRONMENTAL:
require('dotenv').config()
process.env.URL = process.env.URL || 'https://napchart.com/'

var database = require('./database/database')

var api = require('./api/api')

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))

// <PRODUCTION> send gzipped file
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


app.get(['/', '/app'], function (req, res) {
  var file = nunjucks.render(__dirname + '/../client/index.html', {
    siteUrl: process.env.URL
  })
  res.send(file)
})

app.get('/:chartid', function (req, res, next) {
  var chartid = req.params.chartid

  if (typeof process.env.SERVER_URI === 'undefined') {
    res.status(503).send('Database not connected')
  }

  database.getChart(chartid, function (err, response) {
    if (err) throw new Error(err)

    if (response == null) {
      return next()
    }

    var metaInfo = response.metaInfo || {}
    var title = metaInfo.title || ''
    var description = metaInfo.description || ''

    var file = nunjucks.render(__dirname + '/../client/index.html', {
      siteUrl: process.env.URL,
      data: {
        chartid: chartid,
        title: title.length == 0 ? false : title,
        description: description.length == 0 ? false : description
      }
    })

    res.send(file)
  })
})

app.all('/api/*', function (req, res, next) {
  // if (typeof process.env.SERVER_URI === 'undefined') {
  //   res.status(503).send('Database not connected')
  // }
  next()
})

app.post('/api/create', api.create)
app.post('/api/postFeedback', api.postFeedback)
app.get('/api/get', api.get)
app.get('/api/getImage', api.getImage)

var port = process.env.PORT || 3000
app.listen(port, "0.0.0.0", function () {
  console.log(`listening at ${port}`)
})