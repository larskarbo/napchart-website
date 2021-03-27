module.exports = (user) => {
  return {
    email: user.email,
    username: user.username,
    email_verified: user.email_verified,
  }
}
