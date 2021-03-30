import { pool } from '../database'
import { asyncIncrementVisit } from './utils/asyncIncrementVisit'
import { ChartDocument } from '../../src/components/Editor/types'
import { ChartCreationReturn } from './createChart'
import { WEB_BASE } from '../utils/webBase'
import { getProperLink } from '../utils/getProperLink'

//FIKK IKKJE TIL:
// const chartidSchema =
//   Joi.string().pattern(new RegExp(/([a-z]|\d){5,6}/), { name: '5-char chartid' }).required()
//   // Joi.string().pattern(new RegExp(/([a-z]|\d){6}/), { name: '6-char chartid' }),
//   // Joi.string().pattern(new RegExp(/(\w|\d){9}/), { name: '9-char modern chartid' })
// // ).required()

export const getChart = async function (req, res) {
  // const validate = chartidSchema.validate(req.params.chartid)

  // if (validate.error) {
  //   return sendValidationError(res, validate.error)
  // }

  const chartid = req.params.chartid
  console.log('chartid: ', chartid)

  pool.query('SELECT * FROM charts WHERE chartid = $1 AND deleted = false', [chartid], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length == 0) {
      return res.status(404).send({
        message: 'not found',
      })
    }

    const chart = results.rows[0]

    asyncIncrementVisit(chartid)

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

    if (chartDocument.isPrivate && chartDocument.username != req.user?.username) {
      return res.status(401).send({
        message: "The chart is private",
      })
    }

    const sendThis: ChartCreationReturn = {
      chartDocument,
      publicLink:
        WEB_BASE +
        (chartDocument.isSnapshot
          ? `/snapshot/${chartDocument.chartid}`
          : getProperLink(chartDocument.username, chartDocument.title, chartDocument.chartid)),
    }

    res.send(sendThis)
  })
}
