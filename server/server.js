var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var nunjucks = require('nunjucks')
var argv = require('minimist')(process.argv.slice(2))
var database = require('./database/database')

require('dotenv').config()

var api = require('./api/api')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
app.use(express.static(path.resolve(__dirname + '/../favicon/generated')))

app.get('/', function (req, res) {
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
    var title = response.metaInfo.title
    var description = response.metaInfo.description
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

var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log(`listening at ${port}`)
})
