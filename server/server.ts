import { config } from 'dotenv'
config()
import app from './serverRoutes'
import { isDev } from './utils/webBase'

import http from 'http'
const server = http.createServer(app)
const PORT = 3200 || process.env.PORT

server.listen(PORT, () => {
  console.log(`${isDev ? '[DEVELOPMENT]' : ''} Listening to port ${PORT}`)
})
