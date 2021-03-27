const getValidationErrorMessage = (validationError) => {
  const { details } = validationError
  const message = details.map((i) => i.message).join(',')
  return message
}

export const sendValidationError = (res, validationError) => {
  res.status(422).json({ message: getValidationErrorMessage(validationError) })
}
