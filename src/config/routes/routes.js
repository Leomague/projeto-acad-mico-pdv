require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { deploy, db } = require('../../controllers/deploy')

const rotas = express();

rotas.use(cors());
rotas.use(express.json());

rotas.get('/', deploy);

module.exports = rotas;