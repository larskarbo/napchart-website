import requestIp from 'request-ip'
import { sendValidationError } from '../utils/sendValidationError'
import { findUniqueId } from './utils/findUniqueId'
import { chartSchema } from './utils/schema'
import { ChartDocument } from '../../src/components/Editor/types'
import Joi from 'joi'
const db = require('../database')
const pRetry = require('p-retry')

const schema = Joi.object({
  chartData: chartSchema,
  metaInfo: Joi.object({
    title: Joi.string().max(100).allow(null, ""),
    description: Joi.string().allow(null, ""),
  }),
})

export const createChart = async function (req, res) {
  const isSnapshot = req.isSnapshot || false
  const validate = schema.validate(req.body)

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { metaInfo, api_flag_user, chartData } = validate.value

  const { title, description } = metaInfo || {}

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
      `INSERT INTO charts (chartid, username, chart_data, title, description, is_snapshot, ip) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [chartid, username, chartData, title, description, isSnapshot, clientIp],
    )
    .then((hey) => {
      const chart = hey.rows[0]

      const chartDocument: ChartDocument = {
        chartData: chart.chart_data,
        chartid: chart.chartid,
        title: chart.title,
        description: chart.description,
        username: chart.username,
        lastUpdated: chart.updated_at,
        isSnapshot: chart.is_snapshot,
      }

      res.send(chartDocument)
    })
    .catch((err) => {
      if (err?.constraint == 'users_chartid_key') {
        res.status(400).send({ message: 'Chartid already exists' })
        return
      }
      res.status(400).send({ message: err.message })
    })
}
