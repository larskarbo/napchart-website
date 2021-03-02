require('dotenv').config()

const app = require('./serverRoutes.js')
const http = require('http')
const server = http.createServer(app)
const PORT = 3200
const { pool } = require('./database')

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    throw err
  }
  console.log(res.rows[0].now)
})

pool.query('SELECT COUNT(*) FROM users', (err, res) => {
  if (err) {
    throw err
  }
  console.log(res.rows[0])
})
