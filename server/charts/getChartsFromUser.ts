const db = require('../database')
import { ChartDocument } from '../../src/components/Editor/types'

export const getChartsFromUser = async function (req, res) {
  const { username } = req.params

  if (username == 'anonymous' || username == 'thumbbot') {
    return res.status(404).send({ message: "Can't get charts from this user" })
  }

  const isMe = req.user && username == req.user?.username

  db.pool.query(
    `SELECT * FROM charts WHERE username = $1 AND is_snapshot = false AND deleted = false ${isMe ? "" : "AND is_private = false"} ORDER BY created_at LIMIT 100`,
    [username],
    (error, results) => {
      if (error) {
        throw error
      }
      // if (results.rows.length == 0) {
      //   return res.status(404).send({
      //     status: 'not found',
      //   })
      // }

      return res.send(
        results.rows.map((chart) => {
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
          return chartDocument
        }),
      )
    },
  )
}
