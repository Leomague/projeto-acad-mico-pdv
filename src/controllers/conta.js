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

  try {
    const categoriaExistente = await dataExistente('categorias', 'id', '=', categoria_id);
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
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  if (!id) {
    return res.status(404).json(chat.error404)
  }

  try {
    const produtoExistente = await dataExistente('produtos', "id", '=', id)

    if (categoria_id) {
      const categoriaExistente = await dataExistente('categorias', "id", "=", categoria_id);

      if (!categoriaExistente) {
        return res.status(400).json(chat.error400)
      }
    }

    if (!produtoExistente) {
      return res.status(400).json(chat.error400);
    }

    const produto = produtoExistente[0];

    const produtoAtualizado = {
      descricao: descricao || produto.descricao,
      quantidade_estoque: quantidade_estoque || produto.quantidade_estoque,
      valor: valor || produto.valor,
      categoria_id: categoria_id || produto.categoria_id
    };

    if (
      produtoAtualizado.descricao === produto.descricao &&
      produtoAtualizado.quantidade_estoque === produto.quantidade_estoque &&
      produtoAtualizado.valor === produto.valor &&
      produtoAtualizado.categoria_id === produto.categoria_id
    ) {
      return res.status(304).json()
    }

    await knex("produtos").where({ id }).update(produtoAtualizado);

    return res.status(200).json(chat.status200);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarProdutos = async (req, res) => {
  try {
    const produtos = await knex('produtos');
    if (produtos.length < 1) {
      return res.status(404).json(chat.error404);
    }
    return res.status(200).json(produtos)

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const DetalharProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produtoExistente = await dataExistente('produtos', 'id', '=', id);

    if (produtoExistente.length < 1) {
      return res.status(404).json(chat.error404);
    }
    return res.status(200).json(produtoExistente[0])

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json(chat.error404)
  }

  try {
    const produtoExistente = await dataExistente('produtos', 'id', '=', id);

    if (produtoExistente.length < 1) {
      return res.status(404).json(chat.error404)
    }

    const produtoVinculadoEmPedido = await knex('pedido_produtos')
    .where('produto_id','=', id)
    .select('pedido_id');

    if (produtoVinculadoEmPedido.length > 0) {
      return res.status(404).json(chat.error403)
    }

    await knex('produtos').delete().where({ id });

    return res.status(204).json();

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500)
  }
};

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  try {

    const emailExistente = await dataExistente('clientes', 'email', '=', email);

    const cpfExistente = await dataExistente('clientes', 'cpf', '=', cpf);

    if (cpfExistente.length > 0 || emailExistente.length > 0) {
      return res.status(400).json(chat.error400);
    }

    const novoCliente = await knex('clientes').insert({
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
      .returning('*');

    return res.status(201).json(novoCliente[0])

  } catch (error) {
    return res.status(500).json(chat.error500);
  }

}

const editarDadosDoCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json(chat.error400)
  }

  try {
    const clienteExistente = await dataExistente('clientes', 'id', '=', id);

    if (!clienteExistente) {
      return res.status(400).json(chat.error400);
    }

    const cliente = clienteExistente[0];

    if (email) {
      const emailExistente = await knex('clientes')
        .where('email', '=', email)
        .where('id', '<>', id)
        .first();

      if (emailExistente) {
        return res.status(400).json(chat.error400);
      }
    }

    if (cpf) {
      const cpfExistente = await knex('clientes')
        .where('cpf', '=', cpf)
        .where('id', '<>', id)
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

    await knex('clientes').where({ id }).update(clienteAtualizado);

    return res.status(200).json(chat.status200);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
};

const listarClientes = async (req, res) => {

  try {
    const clientes = await knex('clientes');
    if (clientes.length < 1) {
      return res.status(404).json(chat.error404);
    }
    return res.status(200).json(clientes)

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExistente = await dataExistente('clientes', 'id', '=', id);

    if (clienteExistente.length < 1) {
      const clientes = await knex('clientes')
      return res.status(200).json(clientes)
    }
    return res.status(200).json(clienteExistente[0])

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const cadastrarPedido = async (req, res) => {
  try {
    const { cliente_id, observacao, pedidos_produtos } = req.body;

    if (!cliente_id || !pedidos_produtos || pedidos_produtos.length < 1) {
      return res.status(400).json(chat.error400);
    }

    if (!Array.isArray(pedidos_produtos)) {
      return res.status(400).json(chat.error400);
    }

    const clienteExistente = await dataExistente('clientes', 'id', '=', cliente_id);

    if (clienteExistente.length < 1) {
      return res.status(404).json(chat.error404);
    }

    let valorTotal = 0;

    for (const produtoInfo of pedidos_produtos) {
      const { produto_id, quantidade_produto } = produtoInfo;

      let produto = await knex('produtos').where({ id: produto_id }).first();

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      if (produto.quantidade_estoque < quantidade_produto) {
        return res.status(400).json({ error: `Quantidade em estoque insuficiente para o produto ${produto.descricao}` });
      }

      valorTotal += quantidade_produto * produto.valor;

      await knex('produtos').where({ id: produto_id }).decrement('quantidade_estoque', quantidade_produto);
    }

    await knex('pedidos').insert({
      cliente_id,
      observacao,
      valor_total: valorTotal
    })
      .returning('id');

    return res.status(201).json();

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500)
  }
};

module.exports = {
  listarCategorias,
  cadastrarProduto,
  listarProdutos,
  DetalharProduto,
  deletarProduto,
  detalharCliente,
  editarProduto,
  editarDadosDoCliente,
  listarClientes,
  cadastrarCliente,
  cadastrarPedido
};
