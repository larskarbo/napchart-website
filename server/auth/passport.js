var passport = require('passport')
var Strategy = require('passport-local').Strategy
var database = require('../database/database')

passport.use(new Strategy(
  function(username, password, cb) {
    var query;
    var emailrules = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(emailrules.test(username)){
      query = {
        email: username
      }
    } else {
      query = {
        username: username
      }
    }
    database.verifyUser(query, password, function (err, user) {
      if (err){
        return cb(err)
      }
      if(user){
        //true log him in
        return cb(null, user)
      }else{
        return cb(null, false)
      }
    })
}))

passport.serializeUser(function(user, cb) {
  cb(null, user._id)
})

passport.deserializeUser(function(_id, cb) {
  database.findUser(_id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

module.exports = passport