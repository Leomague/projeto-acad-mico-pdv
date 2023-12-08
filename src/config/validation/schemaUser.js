const validateBodyRequest = joiSchema => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body)
    next()

  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

const validateHeadersRequest = token => async (req, res, next) => {
  try {
    await token.validateAsync(req.headers)
    next()

  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

module.exports = {
  validateBodyRequest,
  validateHeadersRequest
}
