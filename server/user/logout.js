const logout = async (req, res) => {
  //send the access token to the client inside a cookie
  res.cookie('jwt', '', { secure: false, httpOnly: true })
  res.send({ logged: 'out' })
}
exports.logout = logout
