require('dotenv').config();
const express = require('express');
const limitingRequests = require('../security/limitingRequests');
const cors = require('cors');

const conta = require('../../controllers/conta');
const usuario = require('../../controllers/usuario');
const { login } = require('../../controllers/login');
const usuarioLogado = require('../middleware/usuarioLogado');
const { validateBodyRequest } = require('../validation/schemaUser');
const schema = require('../middleware/validarCorpo');
const multer = require('../middleware/multer');

const rotas = express();

rotas.use(limitingRequests);
rotas.use(cors());

rotas.get('/categorias', conta.listarCategorias);
rotas.post('/usuario', validateBodyRequest(schema.schemaCadastroUsuario), usuario.cadastrarUsuario);
rotas.post('/login', validateBodyRequest(schema.schemaLogin), login);

rotas.use(usuarioLogado)

rotas.put('/usuario', usuario.editarPerfil);
rotas.get('/perfil', usuario.detalharPerfil);
rotas.post('/produto', multer.single('produto_imagem'), validateBodyRequest(schema.schemaCadastroProduto), conta.cadastrarProduto);
rotas.get('/produto', conta.listarProdutos);
rotas.get('/produto/:id', conta.DetalharProduto);
rotas.put('/produto/:id', multer.single('produto_imagem'), conta.editarProduto);
rotas.delete('/produto/:id', conta.deletarProduto);
rotas.post('/cliente', validateBodyRequest(schema.schemaValidarCliente), conta.cadastrarCliente);
rotas.put('/cliente/:id', validateBodyRequest(schema.schemaEditarCliente), conta.editarDadosDoCliente);
rotas.get('/cliente', conta.listarClientes);
rotas.get('/cliente/:id', conta.detalharCliente);
rotas.get('/pedido', conta.cadastrarPedido);
rotas.get('/pedido', conta.listarPedidos );

module.exports = rotas;
