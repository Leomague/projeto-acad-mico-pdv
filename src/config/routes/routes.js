require('dotenv').config();
const express = require('express');
const cors = require('cors');

const {
  listarCategorias,
  cadastrarProduto,
  editarProduto,
  editarDadosDoCliente,
  listarClientes,
  cadastrarCliente,
  detalharCliente,
  listarProdutos,
  DetalharProduto,
  deletarProduto,
  cadastrarPedido
} = require('../../controllers/conta');
const { cadastrarUsuario } = require('../../controllers/usuario');
const { login } = require('../../controllers/login');
const usuarioLogado = require('../middleware/usuarioLogado');
const { editarPerfil, detalharPerfil } = require('../../controllers/usuario');
const { validateBodyRequest } = require('../validation/schemaUser');
const { schemaLogin, schemaCadastroUsuario, schemaCadastroProduto, SchemaValidarCliente, SchemaEditarCliente } = require('../middleware/validarCorpo');

const rotas = express();

rotas.use(cors());

rotas.get('/categorias', listarCategorias);
rotas.post('/usuario', validateBodyRequest(schemaCadastroUsuario), cadastrarUsuario);
rotas.post('/login', validateBodyRequest(schemaLogin), login);

rotas.use(usuarioLogado)

rotas.put('/usuario', editarPerfil);
rotas.get('/perfil', detalharPerfil);
rotas.post('/produto', validateBodyRequest(schemaCadastroProduto), cadastrarProduto);
rotas.get('/produto', listarProdutos);
rotas.get('/produto/:id', DetalharProduto);
rotas.put('/produto/:id', editarProduto);
rotas.delete('/produto/:id', deletarProduto);
rotas.post('/cliente', validateBodyRequest(SchemaValidarCliente), cadastrarCliente);
rotas.put('/cliente/:id', validateBodyRequest(SchemaEditarCliente), editarDadosDoCliente);
rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);
rotas.get('/pedido', cadastrarPedido)

module.exports = rotas;
