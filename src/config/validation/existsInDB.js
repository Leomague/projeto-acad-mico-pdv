const knex = require('../connection/connection');

const dataExistente = async (tabela, campo, simb, valor) => {
  try {
    const resultado = await knex(tabela).where(campo, simb, valor);
    return resultado;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  dataExistente,
};
