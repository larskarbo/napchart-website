import { pool } from '../database'
import { asyncIncrementVisit } from './utils/asyncIncrementVisit'
import { ChartDocument } from '../../src/components/Editor/types';
import Joi from 'joi';

import { sendValidationError } from '../utils/sendValidationError';


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
  console.log('chartid: ', chartid);

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
    }

    return res.send(chartDocument)
  })
}
