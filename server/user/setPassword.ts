import Joi from 'joi'
import { pool } from '../database'
import { sendValidationError } from '../utils/sendValidationError'
import { encrypt } from './authUtils/encrypt'
import { pwSchema } from './authUtils/userSchema'

const schema = Joi.object({
  password: pwSchema,
  token: Joi.string().required(),
})

export const setPassword = async (req, res) => {
  const validate = schema.validate({
    token: req.body.token,
    password: req.body.password,
  })

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { token, password } = validate.value

  const user_token_doc = (await pool.query('SELECT * FROM user_tokens WHERE token = $1', [token]))?.rows?.[0]
  console.log('user_token_doc: ', user_token_doc)
  if (!user_token_doc) {
    res.status(401).send({ success: false, message: 'token not matching anything' })
    return
  }

  const passwordHash = await encrypt(password)
  console.log('passwordHash: ', passwordHash)

  pool
    .query(`UPDATE users SET password_hash=$1, email_verified=TRUE WHERE id=$2`, [passwordHash, user_token_doc.user_id])
    .then((hey) => {
      res.send({
        sucess: true,
      })
    })
    .catch((err) => {
      res.status(400).send({ err: err })
    })
}
