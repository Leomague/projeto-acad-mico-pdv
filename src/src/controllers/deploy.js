const knex = require('../config/connection/connection')

const deploy = async (req, res) => {
  try {

    const id = 1

    const msg = await knex('deploy').select('mensagem').where({ id });

    return res.json(msg);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json('erro no servidor')
  }
}

module.exports = {
  deploy
}
