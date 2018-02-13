
var database = require('../database/database')
var passport = require('passport')

module.exports = {
  login: function (req, res, next) {
    passport.authenticate('local', {session: false}, function(err, user) {
      if(err){
        return res.status(500).send({errmsg:err})
      }
      console.log(user)

      if(user){
        req.logIn(user, function(err) {
          if (err) return next(err)
          console.log('uses', req.user)
          return res.send(user)
        });
      }else{
        res.status(401).send({errmsg:'Wrong username or password'})
      }
	    
	  })(req, res, next)
  },

  signup: function (req, res) {
  	console.log(req.body)
    var data = req.body

    var usernamerules = /^(?!_)\w{3,15}$/
    if(!usernamerules.test(data.username)){
    	return res.status(422).send('Username validation failed')
    }
    var emailrules = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!emailrules.test(data.email)){
    	return res.status(422).send('Email validation failed')
    }
    var passwordrules = /.{6,}$/
    if(!passwordrules.test(data.password)){
    	return res.status(422).send('Password too short')
    }

    database.addUser(data, function (err, response) {
      if (err) {
      	return res.status(500).send(err)
      }

      res.send(response)
    })
  },

  available: function(req, res) {
  	var what = req.params.what

  	var value = req.body[what]

  	console.log(what, value)

    if(typeof value == 'undefined'){
      return res.status(500).send('value is not defined')
    }

  	database.userExists({[what]: value}, function (err, exists) {
      if (err) {
      	return res.status(500).send(err)
      }

      res.send(!exists)
    })
  }
}
