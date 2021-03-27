const db = require('../database')

export const getChartsFromUser = async function (req, res) {
  const { username } = req.params

  db.pool.query('SELECT * FROM charts WHERE username = $1 AND is_snapshot = false', [username], (error, results) => {
    console.log('results: ', results.rows)
    if (error) {
      throw error
    }
    // if (results.rows.length == 0) {
    //   return res.status(404).send({
    //     status: 'not found',
    //   })
    // }

    return res.send(
      results.rows.map((chart) => ({
        chartData: chart.chart_data,
        chartid: chart.chartid,
        title: chart.title,
        description: chart.description,
      })),
    )
  })
}
