const pool = require('../config/connection/connection');
const bcrypt = require('bcrypt');
const { error400, error500 } = require('../config/chat/statusCode')


const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ error400, });
    }
    const emailExiste = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (emailExiste.rowCount > 0) {
      return res.status(400).json({ error400 });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const query =
      "insert into usuarios (nome,email,senha) values ($1,$2,$3) returning *";

    const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

    const { senha: _, ...usuario } = rows[0];
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error500 });
  }
};

const login = 'login';

//todas as rotas abaixo devem conter validacao do token de autenticação do usuario logado.

const detalharPerfi = 'detalhar perfil do usuario logado';

const editarPerfil = 'editar perfil do usuario logado';

module.exports = {
  cadastrarUsuario,
  login,
  detalharPerfi,
  editarPerfil
}
