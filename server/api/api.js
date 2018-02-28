var database = require('../database/database')
var getImage = require('./getImage')
var fs = require('fs')

module.exports = {
  create: function (req, res) {
    // which user does this belong to??
    if (req.user) {
      data.author = req.user.username
    }

    database.createChart(data, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  },

  get: function (req, res) {
    var chartid = req.query.chartid

    database.getChart(chartid, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  },

  getImage: getImage,

  postFeedback: function (req, res) {
    database.addFeedback(data, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  }
}
