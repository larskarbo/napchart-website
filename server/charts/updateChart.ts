const db = require('../database')

export const updateChart = async function (req, res) {
  const { chartData, title, description } = req.body
  console.log('chartData, title, description: ', chartData, title, description)
  const { chartid } = req.params

  const username = req.user.username

  if (!username) {
    return res.status(401).send({ message: 'No username' })
  }

  db.pool
    .query(
      `UPDATE charts SET chartid=$1, chart_data=$2, title=$3, description=$4 WHERE chartid = $5 AND username = $6 RETURNING chartid`,
      [chartid, chartData, title, description, chartid, username],
    )
    .then((hey) => {
      if (hey.rows.length == 0) {
        res.status(401).send({ message: 'No permission for this' })
        return
      }
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
      res.status(400).send({ error: err })
    })
}
