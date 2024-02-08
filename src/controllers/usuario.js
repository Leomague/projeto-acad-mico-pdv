const knex = require('../config/connection/connection');
const bcrypt = require('bcrypt');
const chat = require('../config/chat/statusCode');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../config/security/passwordJwt');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
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
    console.log(error);
    return res.status(500).json(chat.error500);
  }
};


const detalharPerfil = async (req, res) => {
  return res.json(req.user)
};

const editarPerfil = async (req, res) => {
  const { nome, email, senha } = req.body;
  const usuarioLogado = req.user;

  try {
    if (email) {
      const emailEmUso = await knex("usuarios")
        .select("id")
        .where({ email })
        .where("id", "<>", usuarioLogado.id)
        .first();

      if (emailEmUso) {
        return res.status(401).json(chat.error401);
      }
    }

    const usuarioAtualizado = {
      nome: nome || usuarioLogado.nome,
      email: email || usuarioLogado.email,
      senha: senha || usuarioLogado.senha
    };

    if (senha && senha !== usuarioLogado.senha) {
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      usuarioAtualizado.senha = senhaCriptografada;
    }

    await knex("usuarios")
      .where("id", usuarioLogado.id)
      .update(usuarioAtualizado);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharPerfil,
  editarPerfil
};
