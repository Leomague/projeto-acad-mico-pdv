require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { editarPerfil } = require('../../controllers/usuario');
const { login } = require('../../controllers/login');
const { cadastrarUsuario } = require('../../controllers/usuario')
const { listarCategorias } = require('../../controllers/conta');


const rotas = express();

rotas.use(express.json());

rotas.use(cors());

rotas.put('/usuario', editarPerfil)
rotas.get('/categorias', listarCategorias);
rotas.post('/usuario', cadastrarUsuario);

rotas.post('/login', login);

module.exports = rotas;
