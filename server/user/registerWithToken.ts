const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../database')
const { urlAlphabet, customAlphabet } = require('nanoid')
const { encrypt } = require('./encrypt')
const { alphanumeric } = require('nanoid-dictionary')
const id = customAlphabet(alphanumeric, 48)

export const registerWithToken = async (req, res) => {
  var name = req.body.name
  var email = req.body.email

  if (!name) {
    // return res.status(400).send({ message: "name is missing" });
  }
  if (!email) {
    return res.status(400).send({ message: 'email is missing' })
  }
  // if (!password) {
  //   return res.status(400).send({ message: "password is missing" });
  // }

  const userExists = false
  if (userExists) {
    res.status(409).send({ message: 'email already in use' })
  } else {
    const token = id(48)
    const tokenHash = await encrypt(token)

    db.pool
      .query('INSERT INTO users (name, email, token_hash) VALUES ($1, $2, $3)', [name, email, tokenHash])
      .then((hey) => {
        //use the payload to store information about the user such as email, user role, etc.
        res.send({
          email,
          token,
        })
      })
      .catch((err) => {
        if (err?.constraint == 'users_email_key') {
          res.status(400).send({ message: 'Email already exists' })
          return
        }
        res.status(400).send({ error: err })
      })
  }
}
