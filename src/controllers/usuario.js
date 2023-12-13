const knex = require("../config/connection/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const cadastro = "cadastrar usuario";

const login = "login";

//todas as rotas abaixo devem conter validacao do token de autenticação do usuario logado.

const detalharPerfi = "detalhar perfil do usuario logado";

const editarPerfil = async (req, res) => {
  const { nome, email, senha } = req.body;
  const usuarioLogado = req.usuario;

  if (!nome && !email && !senha) {
    return res
      .status(400)
      .json({ mensagem: "Ao menos um campo deve ser informado" };
  }

  try {
    const emailEmUso = await knex("usuarios")
      .select("id")
      .where("email", email)
      .where("id", "<>", usuarioLogado.id)
      .first();

    if (emailEmUso) {
      return res
        .status(400)
        .json({ mensagem: "O email já está em uso por outro usuário" });
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
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastro,
  login,
  detalharPerfi,
  editarPerfil,
};
