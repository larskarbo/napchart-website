var mongoose = require('mongoose')

var server_uri = process.env.SERVER_URI
if (typeof server_uri == 'undefined') {
  console.log('No SERVER_URI env present')
} else {
  mongoose.connect(server_uri)
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
}


var Chart = require('./models/Chart')
var Feedback = require('./models/Feedback')

module.exports = {
  connection: mongoose.connection,
  createChart: function (data, callback) {
    var chart = new Chart(data)

    chart.save(function (err, response) {
      callback(err, response)
    })
  },

  getChart: function (chartid, callback) {
    Chart.findOne({
      id: chartid
    }, callback)
  },

  addFeedback: function (f, callback) {
    var feedback = new Feedback({
      feedback: f
    })

    feedback.save(function (err, response) {
      callback(err, response)
    })
  },
}