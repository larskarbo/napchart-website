
var database = require('../database/database')
var getImage = require('./getImage')
var fs = require('fs')

module.exports = {
  create: function (req, res) {
    var data = JSON.parse(req.body.data)
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
  
  postFeedback: function(req, res) {
    var data = JSON.parse(req.body.data)
    database.addFeedback(data, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  },

  getBlogPost: function (req, res) {
    var post = req.params.post

    fs.readFile(`${__dirname}/../../blog-src/${post}.md`, "utf8", (err, data) => {
      if (err) throw err;
      
      res.send(JSON.stringify(data))
    });
  }
}
