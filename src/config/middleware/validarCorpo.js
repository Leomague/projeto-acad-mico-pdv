const joi = require('joi');

const schemaCadastro = joi.object({
  nome: joi.string().min(3).max(30).required().messages({
    'string.min': 'O campo nome deve ter pelo menos 3 caracteres',
    'string.max': 'O campo nome deve ter no máximo 30 caracteres',
    'any.required': 'O campo nome é obrigatório',
    'string.empty': 'O campo nome é obrigatório'
  }),
  email: joi.string().email().required().messages({
    'string.email': 'O campo de email deve ter um formato válido',
    'any.required': 'O campo de email é obrigatório',
    'string.empty': 'O campo de email é obrigatório'
  }),
  senha: joi.string().min(4).required().messages({
    'string.min': 'O campo de senha deve ter pelo menos 4 caracteres',
    'any.required': 'O campo de senha é obrigatório',
    'string.empty': 'O campo de senha é obrigatório'
  })
});

const schemaLogin = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'O campo de email deve ter um formato válido',
    'any.required': 'O campo de email é obrigatório',
    'string.empty': 'O campo de email é obrigatório'
  }),
  senha: joi.string().min(4).required().messages({
    'string.min': 'O campo de senha deve ter pelo menos 4 caracteres',
    'any.required': 'O campo de senha é obrigatório',
    'string.empty': 'O campo de senha é obrigatório'
  })
});

module.exports = {
  schemaCadastro,
  schemaLogin
};
