const { customAlphabet } = require('nanoid')
const generateRandomId = customAlphabet('abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789', 4)
const db = require('../database')
const pRetry = require('p-retry');

const findUniqueId = async () => {
  const chartid = generateRandomId() + ":" + generateRandomId()
  return await db.pool
    .query(`select exists(select true from charts where chartid=$1)`, [
      chartid,
    ])
    .then((hey) => {
      if(hey.rows[0].exists){
        throw new Error("Not unique")
      }
      return chartid
    })
}

const createChart = async function (req, res) {
  const { chartData, metaInfo, api_flag_user } = req.body

  const { title, description } = metaInfo || {}
  
  const chartid = await pRetry(findUniqueId, {retries: 3, minTimeout:0})
  .catch(() => {
    res.status(500).send({
      message: "couldn't find unique id"
    })
    return
  })

  if(!chartid){
    return
  }

  let username = req.user ? req.user.username : 'anonymous'

  if(username == "anonymous"){
    if(api_flag_user == "thumbbot"){
      username = "thumbbot"
    }
  }

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
        res.status(400).send({ message: 'Chartid already exists' })
        return
      }
      res.status(400).send({ error: err })
    })
}

exports.createChart = createChart
