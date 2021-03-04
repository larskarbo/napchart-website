const { customAlphabet } = require('nanoid')
const generateRandomId = customAlphabet('abcdefghijklmnopqrstuwxyz0123456789', 6)
const db = require('../database')

const createChart = async function (req, res) {
  const { chartData, metaInfo } = req.body

  const { title, description } = metaInfo || {}

  const chartid = generateRandomId()

  const username = req.user ? req.user.username : 'anonymous'

  db.pool
    .query(`INSERT INTO charts (chartid, username, chart_data, title, description) VALUES ($1, $2, $3, $4, $5)`, [
      chartid,
      username,
      chartData,
      title,
      description,
    ])
    .then((hey) => {
      res.send({
        chartid,
      })
    })
    .catch((err) => {
      console.log('err: ', err)
      if (err?.constraint == 'users_chartid_key') {
        res.status(400).send({ error: 'Chartid already exists' })
        return
      }
      res.status(400).send({ error: err })
    })
}

exports.createChart = createChart
