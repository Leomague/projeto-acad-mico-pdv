require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { deploy } = require('../../controllers/deploy');
const { editarPerfil } = require('../../controllers/usuario');

const rotas = express();

rotas.use(cors());
rotas.use(express.json());

rotas.get('/', deploy);
rotas.put('/usuario', editarPerfil)

module.exports = rotas;
