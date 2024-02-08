const knex = require("../config/connection/connection");
const chat = require("../config/chat/statusCode");
const { dataExistente } = require("../config/validation/existsInDB");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const emailExistente = await dataExistente("clientes", "email", "=", email);

    const cpfExistente = await dataExistente("clientes", "cpf", "=", cpf);

    if (cpfExistente.length > 0 || emailExistente.length > 0) {
      return res.status(400).json(chat.error400);
    }

    const novoCliente = await knex("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado
      })
      .returning("*");

    return res.status(201).json(novoCliente[0]);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const editarDadosDoCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json(chat.error400);
  }

  try {
    const clienteExistente = await dataExistente("clientes", "id", "=", id);

    if (clienteExistente < 1) {
      return res.status(404).json(chat.error404);
    }
    const cliente = clienteExistente[0];

    if (email) {
      const emailExistente = await knex("clientes")
        .where("email", "=", email)
        .where("id", "<>", id)
        .first();

      if (emailExistente) {
        return res.status(400).json(chat.error400);
      }
    }

    if (cpf) {
      const cpfExistente = await knex("clientes")
        .where("cpf", "=", cpf)
        .where("id", "<>", id)
        .first();

      if (cpfExistente) {
        return res.status(400).json(chat.error400);
      }
    }

    const clienteAtualizado = {
      nome: nome || cliente.nome,
      email: email || cliente.email,
      cpf: cpf || cliente.cpf,
      cep: cep || cliente.cep,
      rua: rua || cliente.rua,
      numero: numero || cliente.numero,
      bairro: bairro || cliente.bairro,
      cidade: cidade || cliente.cidade,
      estado: estado || cliente.estado
    };

    if (
      clienteAtualizado.nome === cliente.nome &&
      clienteAtualizado.email === cliente.email &&
      clienteAtualizado.cpf === cliente.cpf &&
      clienteAtualizado.cep === cliente.cep &&
      clienteAtualizado.rua === cliente.rua &&
      clienteAtualizado.numero === cliente.numero &&
      clienteAtualizado.bairro === cliente.bairro &&
      clienteAtualizado.cidade === cliente.cidade &&
      clienteAtualizado.estado === cliente.estado
    ) {
      return res.status(304).json();
    }

    await knex("clientes").where({ id }).update(clienteAtualizado);

    return res.status(200).json(chat.status200);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex("clientes");
    if (clientes.length < 1) {
      return res.status(404).json(chat.error404);
    }
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExistente = await dataExistente("clientes", "id", "=", id);

    if (clienteExistente.length < 1) {
      const clientes = await knex("clientes");
      return res.status(200).json(clientes);
    }
    return res.status(200).json(clienteExistente[0]);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

module.exports = {
  cadastrarCliente,
  listarClientes,
  detalharCliente,
  editarDadosDoCliente
};
