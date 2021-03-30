const getValidationErrorMessage = (validationError) => {
  const { details } = validationError
  const message = details.map((i) => i.message).join(',')
  return message
}

export const sendValidationError = (res, validationError) => {
  res.status(422).json({ message: getValidationErrorMessage(validationError) })
}

export const getValidatedDataIfGood = (res, schema, data) => {
  const validate = schema.validate(data)

  if (validate.error) {
    sendValidationError(res, validate.error)
    return [false, {}]
  }

  return [true, validate.value]
}