const knex = require('../connection/connection');

const dataExistente = async (tabela, campo, valor) => {
  try {
    const resultado = await knex(tabela).where(campo, '=', valor).first();
    return resultado;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  dataExistente,
};
