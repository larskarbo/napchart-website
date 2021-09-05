import { getEnv } from "@larskarbo/get-env"

console.log('getEnv("NODE_ENV"): ', getEnv("NODE_ENV"))
export const isDev = getEnv("NODE_ENV") == 'development'
export const WEB_BASE = isDev ? `http://localhost:3000` : `https://napchart.com`
