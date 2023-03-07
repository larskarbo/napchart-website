import Joi from 'joi'
import { chartDataSchema, chartDataSchemaPremium, titleSchema, descriptionSchema } from './utils/schema'
import { getValidatedDataIfGood } from '../utils/sendValidationError'
import { getPrisma } from '../src/utils/prisma'

const updateChartSchema = Joi.object({
  chartData: chartDataSchema,
  title: titleSchema,
  description: descriptionSchema,
  isPrivate: Joi.bool(),
})

const updateChartSchemaPremium = updateChartSchema.keys({
  chartData: chartDataSchemaPremium,
})

export const updateChart = async function (req, res) {
  let schema = updateChartSchema
  if (req.user.isPremium) {
    schema = updateChartSchemaPremium
  }

  const [success, { chartData, title, description, isPrivate }] = getValidatedDataIfGood(res, schema, req.body)
  if (!success) {
    return
  }

  const { chartid } = req.params
  const username = req.user.username

  if (!username) {
    return res.status(401).send({ message: 'No username' })
  }

  const prisma = getPrisma()

  const foundChart = await prisma.chart.findFirst({
    where: {
      chartid: chartid,
      username: username,
    },
  })

  if (!foundChart) {
    res.status(404).send({ message: "The chart doesn't exist" })
    return
  }

  try {
    const updatedChart = await prisma.chart.update({
      where: {
        chartid: foundChart.chartid,
      },
      data: {
        chart_data: chartData,
        title: title,
        description: description,
        is_private: isPrivate,
      },
      select: {
        chartid: true,
      },
    })

    if (!updatedChart) {
      res.status(401).send({ message: 'No permission for this' })
      return
    }

    res.send({
      chartid,
    })
  } catch (err) {
    console.log('err: ', err)
    res.status(400).send({ error: err })
  } finally {
    await prisma.$disconnect() // disconnect from the database
  }
}
