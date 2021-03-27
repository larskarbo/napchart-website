import Joi from 'joi';
import reserved from 'reserved-usernames'

const alsoReserved = ['napchart', 'larskarbo', 'calendar', 'time', 'collection', 'collections', 'snapshot']

export const usernameSchema = Joi.string()
  .alphanum()
  .min(5)
  .max(30)
  .invalid(...reserved)
  .pattern(new RegExp(alsoReserved.join('|'), 'i'), { invert: true, name: 'Reserved usernames' })
  .required();


  export const pwSchema = Joi.string().min(6).required()