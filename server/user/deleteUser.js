const { db } = require('../database')
const bcrypt = require('bcrypt')

const deleteUser = async (req, res) => {
  if (req.user.role != 'admin') {
    res.status(401).send({ message: 'you need to be an admin to see this page' })
    return
  }

  var username = req.body.username

  if (!username) {
    return res.status(400).send({ message: 'username is missing' })
  }

  const user = db.get('users').find({ username: username })

  console.log('🚀 ~ user.value()', user.value())
  if (!user.value()) {
    return res.status(404).send({ message: 'could not find user' })
  }

  db.get('users').remove({ username }).write()
  db.get('reviews')
    .filter({ user: username })
    .each((review) => (review.user = '[deleted]'))
    .write()

  db.get('restaurants')
    .filter({ owner: username })
    .each((r) => (r.deleted = true))
    .write()

  //send the access token to the client inside a cookie
  res.send({
    success: true,
  })
}
exports.deleteUser = deleteUser
