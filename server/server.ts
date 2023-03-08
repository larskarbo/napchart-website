import { config } from 'dotenv'
config()
import app from './serverRoutes'
import { isDev } from './utils/webBase'

import http from 'http'
const server = http.createServer(app)
const PORT = process.env.PORT || 3200

server.listen(PORT, () => {
  console.log(`${isDev ? '[DEVELOPMENT]' : ''} Listening to port ${PORT}`)
})
