require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { deploy } = require('../../controllers/deploy');
const { login } = require('../../controllers/login');
const { cadastrarUsuario } = require('../../controllers/usuario')

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);

rotas.use(cors());
rotas.use(express.json());
rotas.post('/login', login);

rotas.get('/', deploy);

module.exports = rotas;