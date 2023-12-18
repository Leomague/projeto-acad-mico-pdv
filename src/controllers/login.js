const knex = require('../config/connection/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chat = require('../config/chat/statusCode');
const senhaJwt = require('../config/security/passwordJwt');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuarios = await knex('usuarios').where({ email });

    if (usuarios.length < 1) {
      return res.status(400).json(chat.error400);
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json(chat.error400);
    }

    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

    const { senha: _, ...dadosUsuario } = usuario;

    return res.status(200).json({
      usuario: dadosUsuario,
      token
    });

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

module.exports = {
  login
};
