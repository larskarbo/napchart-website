import Joi from 'joi'
import requestIp from 'request-ip'
import { ChartData, ChartDocument } from '../../web/src/components/Editor/types'
import { getPrisma } from '../src/utils/prisma'
import { getProperLink } from '../utils/getProperLink'
import { sendValidationError } from '../utils/sendValidationError'
import { WEB_BASE } from '../utils/webBase'
import { ChartCreationReturn } from './types'
import { findUniqueId } from './utils/findUniqueId'
import { chartDataSchema, chartDataSchemaPremium, descriptionSchema, titleSchema } from './utils/schema'
import { slackNotify } from './utils/slackNotify'

const prisma = getPrisma()

const createChartSchema = Joi.object({
  chartData: chartDataSchema,
  title: titleSchema,
  description: descriptionSchema,
  isPrivate: Joi.boolean().optional().default(false),
})

const createChartSchemaPremium = createChartSchema.keys({
  chartData: chartDataSchemaPremium,
})

export const createChart = async function (req, res) {
  const isSnapshot = req.isSnapshot || false

  let schema = createChartSchema
  if (req.user?.isPremium) {
    schema = createChartSchemaPremium
  }

  const validate = schema.validate(req.body)

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { title, description, api_flag_user, chartData, isPrivate } = validate.value

  const chartid = await findUniqueId(prisma)

  if (!chartid) {
    return res.status(500).send({
      message: "couldn't find unique id",
    })
  }

  if (req.user?.isPremium) {
    slackNotify(
      `Premium chart created by ${req.user.username}. https://napchart.com/${req.user.username}/charts/${chartid}`,
    )
  }

  let username = req.user ? req.user.username : 'anonymous'

  if (username == 'anonymous') {
    if (api_flag_user == 'thumbbot') {
      username = 'thumbbot'
    }
  }

  const clientIp = requestIp.getClientIp(req)

  try {
    const chart = await prisma.chart.create({
      data: {
        chartid: chartid,
        username: username,
        chart_data: chartData,
        title: title,
        description: description,
        is_snapshot: isSnapshot,
        ip: clientIp,
        is_private: isPrivate,
      },
    })

    const chartDocument: ChartDocument = {
      chartData: chart.chart_data as unknown as ChartData,
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
        WEB_BASE +
        (isSnapshot
          ? `/snapshot/${chartDocument.chartid}`
          : getProperLink(chartDocument.username, chartDocument.title, chartDocument.chartid)),
    }

    res.send(sendThis)
  } catch (err) {
    if (err?.meta?.constraintName == 'users_chartid_key') {
      res.status(400).send({ message: 'Chartid already exists' })
      return
    }
    res.status(400).send({ message: err.message })
  }
}
