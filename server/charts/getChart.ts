
import { pool } from '../database';
import { asyncIncrementVisit } from './utils/asyncIncrementVisit';

export const getChart = async function (req, res) {
  const { chartid } = req.params

  pool.query('SELECT * FROM charts WHERE chartid = $1', [chartid], (error, results) => {
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

    return res.send({
      chartData: chart.chart_data,
      chartid: chart.chartid,
      title: chart.title,
      description: chart.description,
      username: chart.username,
      lastUpdated: chart.updated_at,
      isSnapshot: chart.is_snapshot
    })
  })
}
