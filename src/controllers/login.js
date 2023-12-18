const { query } = require('../config/connection/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error400, error500 } = require('../config/chat/statusCode');

const login = async (req, res) => {

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json(error400);
  }

  try {
    const { rowCount, rows } = await query('select * from usuarios where email = $1', [email]);

    if (rowCount <= 0) {
      return res.status(400).json(error400);
    }

    const [usuario] = rows;

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json(error400);
    }

    const token = jwt.sign({ id: usuario.id }, 'senhaSeguraParaToken', { expiresIn: '2h' });

    const { senha: _, ...dadosUsuario } = usuario;

    return res.status(200).json({
      usuario: dadosUsuario,
      token
    });

  } catch (error) {
    return res.status(500).json(error500);
  }
}

module.exports = {
  login
}
