require('dotenv').config()
import app from './serverRoutes'
import { isDev } from './utils/webBase'

const http = require('http')
const server = http.createServer(app)
const PORT = 3200

server.listen(PORT, () => {
  console.log(`${isDev ? '[DEVELOPMENT]' : ''} Listening to port ${PORT}`)
})
