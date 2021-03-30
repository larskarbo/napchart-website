import Joi from 'joi';
import { chartDataSchema, chartDataSchemaPremium, metaInfoSchema } from './utils/schema';
import { pool } from '../database';
import { getValidatedDataIfGood } from '../utils/sendValidationError';

const updateChartSchema = Joi.object({
  chartData: chartDataSchema,
  metaInfo: metaInfoSchema,
  isPrivate: Joi.bool()
})

const updateChartSchemaPremium = updateChartSchema.keys({
  chartData: chartDataSchemaPremium
})

export const updateChart = async function (req, res) {
  let schema = updateChartSchema
  if(req.user.isPremium){
    schema = updateChartSchemaPremium
  }

  const [success, { chartData, title, description, isPrivate }] = getValidatedDataIfGood(res, schema, req.body)
  if(!success){
    return
  }

  const { chartid } = req.params

  const username = req.user.username

  if (!username) {
    return res.status(401).send({ message: 'No username' })
  }

  pool
    .query(
      `UPDATE charts SET chartid=$1, chart_data=$2, title=$3, description=$4, is_private=$5 WHERE chartid = $6 AND username = $7 RETURNING chartid`,
      [chartid, chartData, title, description, isPrivate, chartid, username],
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
      res.status(400).send({ error: err })
    })
}
