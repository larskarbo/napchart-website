
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/napchart')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))


var Chart = require('./models/Chart')
var Feedback = require('./models/Feedback')

module.exports = {
  createChart: function (data, callback) {
    var chart = new Chart(data)

    chart.save(function (err, response) {
      callback(err, response)
    })
  },

  getChart: function (chartid, callback) {
    Chart.findOne({id: chartid}, callback)
  },

  addFeedback: function (f, callback) {
    var feedback = new Feedback({
      feedback: f
    })

    feedback.save(function (err, response) {
      callback(err, response)
    })
  }
}
