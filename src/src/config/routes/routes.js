require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { deploy } = require('../../controllers/deploy')
const { listarCategorias } = require('../../controllers/conta');

const rotas = express();

rotas.use(cors());
rotas.use(express.json());

rotas.get('/categoria', listarCategorias);

module.exports = rotas;
