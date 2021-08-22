import { getEnv } from '@larskarbo/get-env'
import { PublicUserObject } from '../utils/publicUserObject'

const queryString = require('query-string')

const Joi = require('joi')

const schema = Joi.object({
  sso: Joi.string().min(30).required(),
  sig: Joi.string().min(30).required(),
})

const DISCOURSE_CONNECT_SECRET = getEnv("DISCOURSE_CONNECT_SECRET")

export const discourseHandler = async (req, res) => {
  const { sso, sig } = req.query

  const user: PublicUserObject = req.user

  const validate = schema.validate({ sso, sig })

  if (validate.error) {
    const { details } = validate.error
    const message = details.map((i) => i.message).join(',')

    return res.status(422).json({ error: message })
  }


  const payload = require('crypto').createHmac('sha256', DISCOURSE_CONNECT_SECRET).update(sso).digest('hex')

  if (payload != sig) {
    return res.status(401).json({ error: "Payload couldn't be verified" })
  }

  const str = Buffer.from(sso, 'base64').toString()

  const parsed = queryString.parse(str)
  if (!parsed.nonce || !parsed.return_sso_url) {
    return res.status(401).json({ error: 'Error when decoding payload' })
  }

  if (!user.emailVerified) {
    return res.status(401).json({ error: 'Email not verified' })
  }

  const newPayload = {
    nonce: parsed.nonce,
    email: user.email,
    username: user.username,
    external_id: req.userId,
  }

  const newPayloadEncoded = Buffer.from(queryString.stringify(newPayload)).toString('base64')
  const newPayloadEncodedAndHashed = require('crypto')
    .createHmac('sha256', DISCOURSE_CONNECT_SECRET)
    .update(newPayloadEncoded)
    .digest('hex')

  const params = {
    sso: newPayloadEncoded,
    sig: newPayloadEncodedAndHashed,
  }

  const redirectUrl = `${parsed.return_sso_url}?${queryString.stringify(params)}`

  // res.redirect(redirectUrl)
  res.send({
    success: true,
    redirectUrl: redirectUrl,
  })
}
