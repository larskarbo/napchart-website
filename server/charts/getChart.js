const db = require('../database')

const getChart = async function (req, res) {
  const { chartid } = req.params

  db.pool.query('SELECT * FROM charts WHERE chartid = $1', [chartid], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length == 0) {
      return res.status(404).send({
        message: 'not found',
      })
    }

    const chart = results.rows[0]
    return res.send({
      chartData: chart.chart_data,
      chartid: chart.chartid,
      title: chart.title,
      description: chart.description,
      username: chart.username,
    })
  })
}

exports.getChart = getChart
