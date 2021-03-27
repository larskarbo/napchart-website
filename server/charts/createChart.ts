import requestIp from 'request-ip'
import { sendValidationError } from '../utils/sendValidationError'
import { findUniqueId } from './utils/findUniqueId'
import { chartSchema } from './utils/schema'
const db = require('../database')
const pRetry = require('p-retry')

export const createChart = async function (req, res) {
  const isSnapshot = req.isSnapshot || false
  const validate = chartSchema.validate(req.body.chartData)

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const chartData = validate.value

  const { metaInfo, api_flag_user } = req.body

  const { title, description } = req.body.metaInfo || {}

  const chartid = await pRetry(findUniqueId, { retries: 3, minTimeout: 0 })

  if (!chartid) {
    return res.status(500).send({
      message: "couldn't find unique id",
    })
  }

  let username = req.user ? req.user.username : 'anonymous'

  if (username == 'anonymous') {
    if (api_flag_user == 'thumbbot') {
      username = 'thumbbot'
    }
  }

  const clientIp = requestIp.getClientIp(req)
  db.pool
    .query(
      `INSERT INTO charts (chartid, username, chart_data, title, description, is_snapshot, ip) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [chartid, username, chartData, title, description, isSnapshot, clientIp],
    )
    .then((hey) => {
      res.send({
        chartid,
      })
    })
    .catch((err) => {
      console.log('err: ', err)
      if (err?.constraint == 'users_chartid_key') {
        res.status(400).send({ message: 'Chartid already exists' })
        return
      }
      res.status(400).send({ message: err.message })
    })
}
