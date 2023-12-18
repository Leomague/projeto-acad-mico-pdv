
const jwt = require("jsonwebtoken");
const knex = require('../config/connection/connection');
const bcrypt = require('bcrypt');
const chat = require('../config/chat/statusCode');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json(chat.error400);
    }

    const emailExiste = await knex('usuarios').where({ email });

    if (emailExiste.length > 0) {
      return res.status(400).json(chat.error400);
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await knex('usuarios')
      .insert({ nome, email, senha: senhaCriptografada })
      .returning('*');

    return res.status(201).json(novoUsuario[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(chat.error500);
  }
};
//todas as rotas abaixo devem conter validacao do token de autenticação do usuario logado.

const detalharPerfi = "detalhar perfil do usuario logado";

const editarPerfil = async (req, res) => {
  const { nome, email, senha } = req.body;
  const usuarioLogado = req.usuario;

  if (!nome && !email && !senha) {
    return res
      .status(400)
      .json(error400);
  }

  try {
    const emailEmUso = await knex("usuarios")
      .select("id")
      .where("email", email)
      .where("id", "<>", usuarioLogado.id)
      .first();

    if (emailEmUso) {
      return res
        .status(401)
        .json(error401);
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await knex("usuarios").where("id", usuarioLogado.id).update({
      nome,
      email,
      senha: senhaCriptografada,
    });

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(error500);
  }
};

module.exports = {
  cadastrarUsuario,
  detalharPerfi,
  editarPerfil,
};
