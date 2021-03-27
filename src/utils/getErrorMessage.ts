export function getErrorMessage(err) {
  if (!err) {
    return null
  }

  let response = err.response

  if (response) {
    if (typeof response === 'string') {
      return response
    } else if (response.data) {
      if (response.data.message) {
        return response.data.message
      }
      if (response.data.error?.message) {
        return response.data.error.message
      }
    }
  }

  if (typeof err === 'string') {
    return err
  }

  return (err && err.message ? err.message : 'Unknown Error') || 'Unknown Error'
}
