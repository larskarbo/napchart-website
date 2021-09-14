import Joi from 'joi'
import { ChartData } from '../../../web/src/components/Editor/types'
import { max } from "lodash"
const colors = [
  'red',
  'blue',
  'brown',
  'green',
  'gray',
  'yellow',
  'purple',
  'pink',
  'custom_0',
  'custom_1',
  'custom_2',
  'custom_3',
]

const elementSchema = Joi.object({
  start: Joi.number().integer().min(0).max(1440).required(),
  end: Joi.number().integer().min(0).max(1440).required(),
  lane: Joi.number().required(),
  text: Joi.string().allow('', null),
  color: Joi.string()
    .valid(...colors)
    .required(),
})

const enoughLanes = (value: ChartData, helpers) => {
  const highestLane = max(value.elements.map(e => e.lane)) || 0

  if(value.lanes <= highestLane) {
    return helpers.error('There are elements with greater lane number than "lanes".')
  }

  return value
}

export const chartDataSchema = Joi.object({
  elements: Joi.array().items(elementSchema),
  lanes: Joi.number().min(0).required(),
  lanesConfig: Joi.any(),
  shape: Joi.string().valid('circle', 'line', 'wide').required(),
  colorTags: Joi.array().items(Joi.any()),
}).custom(enoughLanes, 'lane valudation')

export const chartDataSchemaPremium = chartDataSchema.keys({
  elements: Joi.array().items(elementSchema),
})

export const titleSchema = Joi.string().max(100).allow(null, '')
export const descriptionSchema = Joi.string().allow(null, '')
