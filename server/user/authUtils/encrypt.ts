const bcrypt = require('bcrypt')

export const encrypt = (password) =>
  new Promise((resolve) => {
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash in your password DB.
      resolve(hash)
    })
  })
