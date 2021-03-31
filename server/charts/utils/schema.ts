import Joi from 'joi'

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

const elementSchemaPremium = elementSchema.keys({
  color: Joi.string().min(3).required(),
})

export const chartDataSchema = Joi.object({
  elements: Joi.array().items(elementSchema),
  lanes: Joi.number().min(0).required(),
  lanesConfig: Joi.any(),
  shape: Joi.string().valid('circle', 'line', 'wide').required(),
  colorTags: Joi.array().items(Joi.any()),
})

export const chartDataSchemaPremium = chartDataSchema.keys({
  elements: Joi.array().items(elementSchema),
})

export const titleSchema = Joi.string().max(100).allow(null, '')
export const descriptionSchema = Joi.string().allow(null, '')
