import Joi from "joi"

const colors = ['red', 'blue', 'brown', 'green', 'gray', 'yellow', 'purple', 'pink']
export const chartSchema = Joi.object({
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