const joi = require('joi');

const schemaCadastroUsuario = joi.object({
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

const schemaCadastroProduto = joi.object({
  descricao: joi.string().required().messages({
    'any.required': 'O campo de descrição é obrigatório',
    'string.empty': 'O campo de descrição é obrigatório'
  }),
  quantidade_estoque: joi.number().positive().required().messages({
    'any.required': 'O campo de quantidade_estoque é obrigatório',
    'string.empty': 'O campo de quantidade_estoque é obrigatório',
    'number.positive': 'o campo quantidade_estoque deve ser um valor positivo'
  }),
  valor: joi.number().positive().required().messages({
    'any.required': 'O campo de valor é obrigatório',
    'string.empty': 'O campo de valor é obrigatório',
    'number.positive': 'o campo valor deve ser um valor positivo'
  }),
  categoria_id: joi.number().positive().required().messages({
    'any.required': 'O campo de categoria_id é obrigatório',
    'string.empty': 'O campo de categoria_id é obrigatório',
    'number.positive': 'o campo categoria_id deve ser um valor positivo'
  })
});

const SchemaValidarCliente = joi.object({
  nome: joi.string().required().messages({
    'any.required': 'O campo nome é obrigatório',
    'string.empty': 'O campo nome é obrigatório'
  }),
  email: joi.string().email().required().messages({
    'string.email': 'O campo de email deve ter um formato válido',
    'any.required': 'O campo de email é obrigatório',
    'string.empty': 'O campo de email é obrigatório'
  }),
  cpf: joi.string().min(11).max(14).required().messages({
    'string.min': 'O campo cpf é muito pequeno',
    'string.max': 'O campo pcf é muito grande',
    'any.required': 'O campo cpf é obrigatório',
    'string.empty': 'O campo cpf é obrigatório'
  }),
  cep: joi.string(),
  rua: joi.string(),
  numero: joi.string(),
  bairro: joi.string(),
  cidade: joi.string(),
  estado: joi.string()
});

const SchemaEditarCliente = joi.object({
  email: joi.string().email().messages({
    'string.email': 'O campo de email deve ter um formato válido'
  }),
  cpf: joi.string().min(11).max(14).messages({
    'string.min': 'O campo cpf é muito pequeno',
    'string.max': 'O campo pcf é muito grande'
  }),
  cep: joi.string(),
  rua: joi.string(),
  numero: joi.string(),
  bairro: joi.string(),
  cidade: joi.string(),
  estado: joi.string()
});

module.exports = {
  schemaCadastroUsuario,
  schemaLogin,
  schemaCadastroProduto,
  SchemaValidarCliente,
  SchemaEditarCliente
};
