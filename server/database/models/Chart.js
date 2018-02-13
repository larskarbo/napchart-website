var mongoose = require('mongoose')

var Schema = mongoose.Schema

var chart = new Schema({
  id: String,
  chartData: {
    elements: [{
      id: Number,
      start: Number,
      end: Number,
      color: String,
      text: String,
      lane: Number,
      _id: false
    }],
    colorTags: [{
      color: String,
      tag: String,
      _id: false
    }],
    shape: String,
    lanes: Number
  },
  metaInfo: {
    title: String,
    description: String
  },
  author: {
    type: String,
    ref: 'User'
  }
})

chart.pre('save', function (next) {
  if (typeof this.id == 'undefined') {
    this.id = idgen()
  }
  next()
})

module.exports = mongoose.model('Chart', chart)

function idgen() {
  alphabet = 'abcdefghijklmnopqrstuwxyz0123456789'
  id = ''
  for (var i = 0; i < 5; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}