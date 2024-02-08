require('dotenv').config();
const express = require('express');
const limitingRequests = require('../security/limitingRequests');
const cors = require('cors');

const { listarCategorias } = require('../../controllers/categorias');
const produto = require('../../controllers/produto')
const usuario = require('../../controllers/usuario');
const usuarioLogado = require('../middleware/usuarioLogado');
const { validateBodyRequest } = require('../validation/schemaUser');
const pedido = require('../../controllers/pedido');
const cliente = require('../../controllers/cliente');
const schema = require('../middleware/validarCorpo');
const multer = require('../middleware/multer');

const rotas = express();

rotas.use(limitingRequests);
rotas.use(cors());

rotas.get('/categorias', listarCategorias);
rotas.post('/usuario', validateBodyRequest(schema.schemaCadastroUsuario), usuario.cadastrarUsuario);
rotas.post('/login', validateBodyRequest(schema.schemaLogin), usuario.login);

rotas.use(usuarioLogado);

rotas.put('/usuario', usuario.editarPerfil);
rotas.get('/perfil', usuario.detalharPerfil);
rotas.post('/produto', multer.single('produto_imagem'), validateBodyRequest(schema.schemaCadastroProduto), produto.cadastrarProduto);
rotas.get('/produto', produto.listarProdutos);
rotas.get('/produto/:id', produto.DetalharProduto);
rotas.put('/produto/:id', multer.single('produto_imagem'), produto.editarProduto);
rotas.delete('/produto/:id', produto.deletarProduto);
rotas.post('/cliente', validateBodyRequest(schema.schemaValidarCliente), cliente.cadastrarCliente);
rotas.put('/cliente/:id', validateBodyRequest(schema.schemaEditarCliente), cliente.editarDadosDoCliente);
rotas.get('/cliente', cliente.listarClientes);
rotas.get('/cliente/:id', cliente.detalharCliente);
rotas.post('/pedido', pedido.cadastrarPedido);
rotas.get('/pedido', pedido.listarPedidos);

module.exports = rotas;
