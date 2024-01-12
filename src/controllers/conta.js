const knex = require("../config/connection/connection");
const chat = require("../config/chat/statusCode");
const { dataExistente } = require("../config/validation/existsInDB");

const listarCategorias = async (req, res) => {
  try {
    const query = "categorias";
    const categorias = await knex(query);
    if (categorias.length < 1) {
      return res.status(404).json(chat.error404);
    }

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
    return res.status(400).json(chat.error400);
  }

  try {
    const categoriaExistente = await dataExistente('categorias', 'id', categoria_id);

    if (!categoriaExistente) {
      return res.status(400).json(chat.error400);
    }

    const novoProduto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id
      })
      .returning("*");

    return res.status(201).json(novoProduto[0]);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  try {
    const produtoExistente = await dataExistente('produtos', "id", id)

    if (!produtoExistente) {
      return res.status(400).json(chat.error400);
    }

    await knex("produtos").where({ id }).update({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id
    });

    return res.status(200).json(chat.status200);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarProdutos = (req, res) => {
  //seu código aqui...
};

const DetalharProduto = (req, res) => {
  //seu código aqui...
};

const deletarProduto = (req, res) => {
  //seu código aqui...
};

const cadastrarCliente = (req, res) => {
  //seu código aqui...
};

const editarDadosDoCLiente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf } = req.body;

  try {
    const clienteExistente = await knex("clientes").where({ id }).first();

    if (!clienteExistente) {
      return res.status(400).json(chat.error400);
    }

    if (!nome || !email || !cpf) {
      return res.status(400).json(chat.error400);
    }

    const emailExistente = await knex("clientes")
      .where("email", email)
      .where("id", "<>", id)
      .first();

    const cpfExistente = await knex("clientes")
      .where("cpf", cpf)
      .where("id", "<>", id)
      .first();

    if (emailExistente) {
      return res.status(400).json(chat.error400);
    }

    if (cpfExistente) {
      return res.status(400).json(chat.error400);
    }

    await knex("clientes").where({ id }).update({
      nome,
      email,
      cpf
    });
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const listarClientes = (req, res) => {
  //seu código aqui...
};

const detalharCliente = (req, res) => {
  //seu código aqui...
};

module.exports = {
  listarCategorias,
  cadastrarProduto,
  editarProduto,
  editarDadosDoCLiente
};
