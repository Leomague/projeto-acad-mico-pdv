const joi = require('joi')

const schemaRegister = joi.object({
  name: joi.string().min(3).max(30).required().messages({
    'string.min': `The nome field must have at least ${3}, characters`,
    'string.max': `The nome field must have at least ${30}, characters`,
    'any.required': 'The nome field is mandatory',
    'string.empty': 'The nome field is mandatory'
  }),
  email: joi.string().email().required().messages({
    'string.email': 'The email field must have a valid format',
    'any.required': 'The email field is mandatory',
    'string.empty': 'The email field is mandatory'
  }),
  password: joi.string().min(4).required().messages({
    'string.min': `The password field must have at least ${4}, characters`,
    'any.required': 'The password field is mandatory',
    'string.empty': 'The password field is mandatory'
  }),

  age: joi.number().positive().messages({
    'number.positive': 'Age must be a positive number',
    'number.base': 'Age must be a number'
  }),
  active: joi.boolean().messages({
    'boolean.base': 'the active field needs to be a boleean'
  })
})

const schemaLogin = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'The email field must have a valid format',
    'any.required': 'The email field is mandatory',
    'string.empty': 'The email field is mandatory'
  }),
  password: joi.string().min(minPass).required().messages({
    'string.min': `The password field must have at least ${minPass}, characters`,
    'any.required': 'The password field is mandatory',
    'string.empty': 'The password field is mandatory'
  }),

  age: joi.number().positive().messages({
    'number.positive': 'Age must be a positive number',
    'number.base': 'Age must be a number'
  }),
  active: joi.boolean().messages({
    'boolean.base': 'the active field needs to be a boleean'
  })
})

module.exports = {
  schemaRegister,
  schemaLogin
}
