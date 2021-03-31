import requestIp from 'request-ip'
import { sendValidationError } from '../utils/sendValidationError'
import { findUniqueId } from './utils/findUniqueId'
import { chartDataSchema, chartDataSchemaPremium, descriptionSchema, titleSchema } from './utils/schema'
import { ChartDocument } from '../../src/components/Editor/types'
import Joi from 'joi'
import { WEB_BASE } from '../utils/webBase'
import { getProperLink } from '../utils/getProperLink'
const db = require('../database')
const pRetry = require('p-retry')



const createChartSchema = Joi.object({
  chartData: chartDataSchema,
  title: titleSchema,
  description: descriptionSchema,
})

const createChartSchemaPremium = createChartSchema.keys({
  chartData: chartDataSchemaPremium
})

export type ChartCreationReturn = {
  chartDocument: ChartDocument
  publicLink: string
}



export const createChart = async function (req, res) {
  const isSnapshot = req.isSnapshot || false

  let schema = createChartSchema
  if(req.user?.isPremium){
    schema = createChartSchemaPremium
  }

  const validate = schema.validate(req.body)

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { title, description, api_flag_user, chartData } = validate.value


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
      `INSERT INTO charts (chartid, username, chart_data, title, description, is_snapshot, ip, is_private) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [chartid, username, chartData, title, description, isSnapshot, clientIp, false],
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
        isPrivate: chart.is_private,
      }

      const sendThis: ChartCreationReturn = {
        chartDocument,
        publicLink:
          WEB_BASE + (isSnapshot
            ? `/snapshot/${chartDocument.chartid}`
            : getProperLink(chartDocument.username, chartDocument.title, chartDocument.chartid)),
      }

      res.send(sendThis)
    })
    .catch((err) => {
      if (err?.constraint == 'users_chartid_key') {
        res.status(400).send({ message: 'Chartid already exists' })
        return
      }
      res.status(400).send({ message: err.message })
    })
}
