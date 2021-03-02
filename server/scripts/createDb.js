const sqlite3 = require('sqlite3').verbose()

console.log('__dirname: ', __dirname)
let userDB = new sqlite3.Database('db.db', sqlite3.OPEN_CREATE, (err) => {
  console.log('err: ', err)
  // do your thing
})

;`
`
