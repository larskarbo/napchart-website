var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var argv = require('minimist')(process.argv.slice(2))
var database = require('./database/database')
var nunjucks = require('nunjucks')
var fs = require('fs')

var api = require('./api/api')
var auth = require('./auth/passport')

require('dotenv').config()

process.env.URL = process.env.URL || 'https://napchart.com/'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(auth.initialize());
app.use(auth.session());

if(process.env.NODE_ENV == 'production'){
	console.log('Starting node server in production mode')
	app.get('*.js', function (req, res, next) {
		console.log('fj')
	  req.url = req.url + '.gz'
	  res.set('Content-Encoding', 'gzip')
	  next()
	})
}

app.use('/public', express.static(path.resolve(__dirname + '/../dist')))
app.use('/public', express.static(path.resolve(__dirname + '/../public')))
app.use(express.static(path.resolve(__dirname + '/../favicon/generated')))

app.get(['/','/app','/blog','/login'], function (req, res) {
  var file = nunjucks.render(__dirname + '/../client/index.html', {
    chartid: false,
    siteUrl: process.env.URL,
    title: false,
    description: false
  })
  res.send(file)
})

app.get('/:whatever', function (req, res) {
  var chartid = req.params.whatever

  database.getChart(chartid, function (err, response) {
    if (err) throw new Error(err)
    if(response == null){
      return res.status(404).send('404')
    }
    var metaInfo = response.metaInfo || {}
    var title = metaInfo.title || ''
    var description = metaInfo.description || ''
    var file = nunjucks.render(__dirname + '/../client/index.html', {
      chartid: chartid,
      siteUrl: process.env.URL,
      title: title.length==0 ? false : title,
      description: description.length==0 ? false : description 
    })

    res.send(file)
  })
})

app.post('/api/create', api.create)
app.post('/api/postFeedback', api.postFeedback)
app.get('/api/get', api.get)
app.get('/api/getImage', api.getImage)
app.get('/api/getBlogPost/:post', api.getBlogPost)

var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log(`listening at ${port}`)
})
