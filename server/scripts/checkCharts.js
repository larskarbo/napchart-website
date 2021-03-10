// In your index.js

require('dotenv').config()
const db = require('../database')

const Joi = require('joi')
const colors = ['red', 'blue', 'brown', 'green', 'gray', 'yellow', 'purple', 'pink']
const schema = Joi.object({
  elements: Joi.array().items(
    Joi.object({
      start: Joi.number().integer().min(0).max(1440).required(),
      end: Joi.number().integer().min(0).max(1440).required(),
      lane: Joi.number().required(),
      text: Joi.string().allow('', null),
      color: Joi.string()
        .valid(...colors)
        .required(),
    }),
  ),
  lanes: Joi.number().min(0).required(),
  lanesConfig: Joi.any(),
  shape: Joi.string().valid('circle', 'line', 'wide').required(),
  colorTags: Joi.array().items(Joi.any()),
})

const example = {
  lanes: 3,
  shape: 'circle',
  elements: [
    { end: 330, lane: 0, text: '', color: 'red', start: 1380 },
    { end: 810, lane: 0, text: '', color: 'red', start: 780 },
    { end: 360, lane: 1, text: '', color: 'purple', start: 1200 },
    { end: 1440, lane: 2, text: '', color: 'black', start: 0 },
  ],
  colorTags: [
    { tag: 'sleep', color: 'red' },
    { tag: 'DP', color: 'purple' },
    { tag: 'polysleep.org', color: 'black' },
  ],
  lanesConfig: { 1: { locked: false } },
}

db.pool.query('SELECT chart_data FROM charts', (error, results) => {
  if (error) {
    throw error
  }

  // let hasLane = 0
  // for (let i = 0; i < results.rows.length; i++) {
  //   const data = results.rows[i].chart_data;
  //   if(data.lanes){
  //     hasLane++
  //   }
  // }
  // console.log('hasLane: ', hasLane);

  const errors = {}
  for (let i = 0; i < results.rows.length; i++) {
    const data = results.rows[i].chart_data
    const validate = schema.validate(data)

    if (validate.error) {
      const { details } = validate.error
      details.forEach((d) => {
        errors[d.message] = errors[d.message] ? errors[d.message] + 1 : 1
        if (d.message.includes('red')) {
          // errors[d.context.value] = errors[d.context.value] ? errors[d.context.value] + 1 : 1
        }
        if (d.message.includes('must be less than or equal to 1440')) {
          // console.log(d)
        }
      })
      // return
    }
  }
  console.log('errors: ', errors)

  console.log('results: ', results.rows.length)
  // if (results.rows.length == 0) {
  //   return res.status(404).send({
  //     status: 'not found',
  //   })
  // }
})
