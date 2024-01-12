require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { listarCategorias, cadastrarProduto, editarProduto, editarDadosDoCLiente, listarClientes } = require('../../controllers/conta');
const { cadastrarUsuario } = require('../../controllers/usuario');
const { login } = require('../../controllers/login');
const usuarioLogado = require('../middleware/usuarioLogado');
const { editarPerfil, detalharPerfi } = require('../../controllers/usuario');
const { validateBodyRequest } = require('../validation/schemaUser');
const { schemaCadastro, schemaLogin } = require('../middleware/validarCorpo');

const rotas = express();

rotas.use(cors());

rotas.get('/categorias', listarCategorias);
rotas.post('/usuario', validateBodyRequest(schemaCadastro), cadastrarUsuario);
rotas.post('/login', validateBodyRequest(schemaLogin), login);
rotas.put('/usuario', usuarioLogado, editarPerfil);
rotas.get('/perfil', usuarioLogado, detalharPerfi);

rotas.post('/produto', usuarioLogado, cadastrarProduto);
rotas.put('/produto/:id', usuarioLogado, editarProduto);
rotas.put('/cliente/:id', usuarioLogado, editarDadosDoCLiente);
rotas.get('/cliente', usuarioLogado, listarClientes)
rotas.post('/cliente', usuarioLogado, cadastrarCliente);

module.exports = rotas;
