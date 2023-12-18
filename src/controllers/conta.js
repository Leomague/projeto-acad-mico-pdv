const knex = require('../config/connection/connection');
const chat = require('../config/chat/statusCode');

const listarCategorias = async (req, res) => {
  try {
    const query = 'categorias'
    const categorias = await knex(query);
    if (categorias.length < 1) {
      return res.status(404).json(chat.error404);
    }

    return res.status(200).json(categorias);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

module.exports = {
  listarCategorias
};
