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

const cadastrarProduto = (req, res) => {
  //seu código aqui...

}

const editarProduto = (req, res) => {
  //seu código aqui...

}

const listarProduto = (req, res) => {
  //seu código aqui...

}

const DetalharProduto = (req, res) => {
  //seu código aqui...

}

const deletarProduto = (req, res) => {
  //seu código aqui...

}

const cadastrarCliente = (req, res) => {
  //seu código aqui...

}

const editarDadosDoCLiente = (req, res) => {
  //seu código aqui...

}

const listarClientes = (req, res) => {
  //seu código aqui...

}

const detalharCliente = (req, res) => {
  //seu código aqui...

}

module.exports = {
  listarCategorias
};
