import { getEnv } from "@larskarbo/get-env"

export const isDev = getEnv("NODE_ENV") == 'development'
export const WEB_BASE = isDev ? `http://localhost:3000` : `https://napchart.com`
