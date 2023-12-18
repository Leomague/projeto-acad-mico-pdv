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

const detalharPerfi = 'detalhar perfil do usuario logado';

const editarPerfil = 'editar perfil do usuario logado';

module.exports = {
  cadastrarUsuario,
  detalharPerfi,
  editarPerfil
}
