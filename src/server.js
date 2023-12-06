const express = require('express');
const rotas = require('./config/routes/routes');

const app = express();

app.use(express.json());

app.use(rotas);

module.exports = app;