var mongoose = require('mongoose')

var Schema = mongoose.Schema

var feedback = new Schema({
	feedback: String
})

module.exports = mongoose.model('Feedback', feedback)
