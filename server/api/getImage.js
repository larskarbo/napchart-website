var database = require('../database/database')
var Napchart = require('napchart')

module.exports = function (req, res) {
  var chartid = req.query.chartid
  var width = req.query.width * 1 // * 1 to ensure they are numbers not strings
	var height = req.query.height * 1
  var shape = req.query.shape

  if(
    typeof chartid == 'undefined' ||
    typeof width == 'undefined' ||
    typeof height == 'undefined'){
    return res.send('Invalid request')
  }

  var Canvas = require('canvas')
  Canvas.registerFont('server/Consolas.ttf', {family: 'Consolas'})

  var Image = Canvas.Image
  var canvas = Canvas.createCanvas(width, height)
  var ctx = canvas.getContext('2d')

	database.getChart(chartid, function (err, response) {
	  if (err) throw new Error(err)
    

    if(typeof shape == 'undefined'){
      shape = response.chartData.shape
    }

    var chartData = {
      elements: response.chartData.elements,
      colorTags: response.chartData.colorTags,
      lanes: response.chartData.lanes,
      shape
    }

    var mynapchart = Napchart.init(ctx, chartData, {
      interaction:false,
      font: 'Consolas',
      background: 'white',
      baseFontSize: 'noscale:1.5'
    })

    canvas.pngStream().pipe(res)
	})
}