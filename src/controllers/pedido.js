const knex = require("../config/connection/connection");
const chat = require("../config/chat/statusCode");
const { dataExistente } = require("../config/validation/existsInDB");
const fs = require('fs/promises');
const send = require("../config/utils/send");
const Handlebars = require('handlebars');

const cadastrarPedido = async (req, res) => {
  try {
    const { cliente_id, observacao, pedidos_produtos } = req.body;

    if (!cliente_id || !pedidos_produtos || pedidos_produtos.length < 1) {
      return res.status(400).json(chat.error400);
    }

    if (!Array.isArray(pedidos_produtos)) {
      return res.status(400).json(chat.error400);
    }

    const clienteExistente = await dataExistente(
      "clientes",
      "id",
      "=",
      cliente_id
    );

    if (!clienteExistente || clienteExistente.length < 1) {
      return res.status(404).json(chat.error404);
    }

    const cliente = clienteExistente[0];

    let valorTotal = 0;

    for (const produtoInfo of pedidos_produtos) {
      const { produto_id, quantidade_produto } = produtoInfo;

      let produto = await knex("produtos").where({ id: produto_id }).first();

      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      if (produto.quantidade_estoque < quantidade_produto) {
        return res
          .status(400)
          .json({
            error: `Quantidade em estoque insuficiente para o produto ${produto.descricao}`,
          });
      }

      valorTotal += quantidade_produto * produto.valor;

      await knex("produtos")
        .where({ id: produto_id })
        .decrement("quantidade_estoque", quantidade_produto);

      await knex('pedido_produtos').insert({
        pedido_id: null,
        produto_id,
        quantidade_produto,
        valor_produto: produto.valor
      })
    }

    const [novoPedido] = await knex('pedidos').insert({
      cliente_id,
      observacao,
      valor_total: valorTotal
    }).returning('id');

    for (let produto of pedidos_produtos) {

      let produto_id = produto.produto_id

      await knex('pedido_produtos')
        .where({ produto_id })
        .update({
          pedido_id: novoPedido.id
        })
    }

    const arquivo = await fs.readFile('src/config/templates/orderEmail.html');

    const compilador = Handlebars.compile(arquivo.toString());

    const htmlMail = compilador({
      nomeusuario: cliente.name
    })

    send(
      `${cliente.name} <${cliente.email}>`,
      'Seu pedido foi um sucesso!',
      htmlMail
    )

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const listarPedidos = async (req, res) => {
  const { cliente_id } = req.query;
  let pedidos = [];
  let retorno = [];

  try {
    if (!cliente_id) {
      pedidos = await knex('pedidos');
    } else {
      pedidos = await knex('pedidos').where("cliente_id", cliente_id);
    }

    if (!pedidos || pedidos.length < 1) {
      return res.status(404).json(chat.error404);
    }

    for (let pedido of pedidos) {
      pedido.pedido_produtos = await knex('pedido_produtos').where('pedido_id', '=', pedido.id)
      retorno.push(pedido);
    }

    return res.status(200).json(retorno);
  } catch (error) {
    return res.status(500).json(chat.error500)
  }
}

module.exports = {
  cadastrarPedido,
  listarPedidos
};
