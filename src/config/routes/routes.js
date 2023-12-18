require('dotenv').config()
const express = require('express');
const cors = require('cors');

const { listarCategorias } = require('../../controllers/conta');
const { cadastrarUsuario } = require('../../controllers/usuario');
const { login } = require('../../controllers/login');
const usuarioLogado = require('../middleware/usuarioLogado');
const { editarPerfil, detalharPerfi } = require('../../controllers/usuario');

const rotas = express();

rotas.use(express.json());

rotas.use(cors());

rotas.get('/categorias', listarCategorias);
rotas.post('/usuario', cadastrarUsuario);

rotas.post('/login', login);
rotas.put('/usuario', usuarioLogado, editarPerfil);
rotas.get('/perfil', usuarioLogado, detalharPerfi);

module.exports = rotas;
