var passport = require('passport')
var Strategy = require('passport-local').Strategy
var database = require('../database/database')

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.password != password) { return cb(null, false) }
      return cb(null, user)
    })
}))

passport.serializeUser(function(user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

module.exports = passport