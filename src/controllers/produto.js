const knex = require("../config/connection/connection");
const chat = require("../config/chat/statusCode");
const { dataExistente } = require("../config/validation/existsInDB");
const { s3Client, PutObjectCommand } = require("../config/lib/aws");
const excluirImagemDoProduto = require('../config/utils/deleteImage');

const cadastrarProduto = async (req, res) => {
  let { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  [quantidade_estoque, valor, categoria_id] = [quantidade_estoque, valor, categoria_id].map(Number);

  const imagem = req.file;

  try {
    const categoriaExistente = await dataExistente(
      "categorias",
      "id",
      "=",
      categoria_id
    );
    if (categoriaExistente < 1) {
      return res.status(404).json(chat.error404);
    }

    // Upload do arquivo

    const Key = `produtos/${encodeURIComponent(descricao)}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.KEY_NAME_BUCKET,
        Key,
        Body: imagem.buffer,
        ContentType: imagem.mimetype
      })
    );

    const s3URL = `https://${process.env.ENDPOINT_BUCKET}/${Key}`;

    const novoProduto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: s3URL
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
  let { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  [quantidade_estoque, valor, categoria_id] = [quantidade_estoque, valor, categoria_id].map(Number);

  const imagem = req.file;

  if (!id) {
    return res.status(404).json(chat.error404);
  }

  try {
    const produtoExistente = await dataExistente("produtos", "id", "=", id);

    if (categoria_id) {
      const categoriaExistente = await dataExistente(
        "categorias",
        "id",
        "=",
        categoria_id
      );

      if (!categoriaExistente) {
        return res.status(400).json(chat.error400);
      }
    }

    if (produtoExistente < 1) {
      return res.status(400).json(chat.error400);
    }

    const produto = produtoExistente[0];

    if (imagem) {
      const Key = `produtos/${encodeURIComponent(produto.descricao)}`

      const s3URL = `https://${process.env.ENDPOINT_BUCKET}/${Key}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.KEY_NAME_BUCKET,
          Key,
          Body: imagem.buffer,
          ContentType: imagem.mimetype
        })
      );

      if (
        descricao === produto.descricao &&
        quantidade_estoque === produto.quantidade_estoque &&
        `${valor}.00` === produto.valor &&
        categoria_id === produto.categoria_id
      ) {
        return res.status(304).json();
      }

      await knex("produtos").where({ id }).update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: s3URL
      });

      return res.status(200).json(chat.status200);
    }

    if (
      descricao === produto.descricao &&
      quantidade_estoque === produto.quantidade_estoque &&
      `${valor}.00` === produto.valor &&
      categoria_id === produto.categoria_id
    ) {
      return res.status(304).json();
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

const listarProdutos = async (req, res) => {
  try {
    const produtos = await knex("produtos");
    if (produtos.length < 1) {
      return res.status(404).json(chat.error404);
    }
    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const DetalharProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produtoExistente = await dataExistente("produtos", "id", "=", id);

    if (produtoExistente.length < 1) {
      return res.status(404).json(chat.error404);
    }
    return res.status(200).json(produtoExistente[0]);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params

  try {

    const produtoExistente = await knex('produtos').where({ id });

    if (!produtoExistente || produtoExistente.length < 1) {
      return res.status(404).json(chat.error404);
    }

    const produtoPedido = await knex('pedido_produtos').where('produto_id', id);

    if (produtoPedido.length > 1) {
      return res.status(403).json(chat.error403);
    }
    const imagemProduto = produtoExistente[0].produto_imagem;

    if (imagemProduto) {
      await excluirImagemDoProduto(imagemProduto)
    }

    await knex('produtos').delete('id').where({ id });

    return res.status(203).json();
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

module.exports = {
  cadastrarProduto,
  editarProduto,
  listarProdutos,
  DetalharProduto,
  deletarProduto
};
