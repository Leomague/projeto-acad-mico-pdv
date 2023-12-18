const chat = require('../chat/statusCode');
const knex = require('../connection/connection');
const jwt = require('jsonwebtoken')
const senhaJwt = require('../security/passwordJwt');

const usuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json(chat.error401);
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, senhaJwt);

    const usuario = await knex('usuarios').where({ id }).first();

    if (!usuario) {
      return res.status(401).json(chat.error401);
    }

    req.user = usuario;

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
};

module.exports = usuarioLogado;
