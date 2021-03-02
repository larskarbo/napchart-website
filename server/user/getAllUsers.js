const { db } = require('../database')

const getAllUsers = async (req, res) => {
  if (req.user.role != 'admin') {
    res.status(401).send({ success: false, message: 'you need to be an admin to see this page' })
    return
  }

  const users = [...db.get('users').value()]

  const usersWithProps = users.map((user) => {
    const newUser = {}
    if (user.role == 'owner') {
      newUser.restaurants = db.get('restaurants').filter({ owner: user.username }).value().length
    }
    newUser.reviews = db.get('reviews').filter({ user: user.username }).value().length
    return {
      ...newUser,
      ...user,
    }
  })

  //send the access token to the client inside a cookie
  res.send({
    users: usersWithProps,
  })
}
exports.getAllUsers = getAllUsers
