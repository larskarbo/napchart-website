var database = require('../database/database')
var Napchart = require('napchart')
const { createCanvas, registerFont } = require('canvas')

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

  registerFont('server/Consolas.ttf', {family: 'Consolas'})

  var canvas = createCanvas(width, height)
  var ctx = canvas.getContext('2d')

  canvas.pngStream().pipe(res)


	// database.getChart(chartid, function (err, response) {
	//   if (err) throw new Error(err)
    
  //   if (!response) {
  //     return res.status(404).send('404')
  //   }

  //   if(typeof shape == 'undefined'){
  //     shape = response.chartData.shape
  //   }

  //   var chartData = {
  //     elements: response.chartData.elements,
  //     colorTags: response.chartData.colorTags,
  //     lanes: response.chartData.lanes,
  //     shape
  //   }

  //   var mynapchart = Napchart.init(ctx, chartData, {
  //     interaction:false,
  //     font: 'Consolas',
  //     background: 'white',
  //     baseFontSize: 'noscale:1.5'
  //   })

  //   canvas.pngStream().pipe(res)
	// })
}