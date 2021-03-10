const queryString = require('query-string')

const Joi = require('joi')

const schema = Joi.object({
  sso: Joi.string().min(30).required(),
  sig: Joi.string().min(30).required(),
})

module.exports = async (req, res) => {
  const { sso, sig } = req.query

  const validate = schema.validate({ sso, sig })

  if (validate.error) {
    const { details } = validate.error
    const message = details.map((i) => i.message).join(',')

    return res.status(422).json({ error: message })
  }

  if (!process.env.DISCOURSE_CONNECT_SECRET) {
    return res.status(500).json({ error: 'No secret specified' })
  }

  const payload = require('crypto').createHmac('sha256', process.env.DISCOURSE_CONNECT_SECRET).update(sso).digest('hex')

  if (payload != sig) {
    return res.status(401).json({ error: "Payload couldn't be verified" })
  }

  const str = Buffer.from(sso, 'base64').toString()

  const parsed = queryString.parse(str)
  if (!parsed.nonce || !parsed.return_sso_url) {
    return res.status(401).json({ error: 'Error when decoding payload' })
  }

  if (!req.user.email_verified) {
    // return res.status(401).json({ error: "Email not verified" })
  }

  const newPayload = {
    nonce: parsed.nonce,
    email: req.user.email,
    username: req.user.username,
    external_id: req.user.id,
  }

  const newPayloadEncoded = Buffer.from(queryString.stringify(newPayload)).toString('base64')
  const newPayloadEncodedAndHashed = require('crypto')
    .createHmac('sha256', process.env.DISCOURSE_CONNECT_SECRET)
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
