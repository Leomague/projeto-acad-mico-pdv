const express = require('express');
const app = express();
const rotas = require('./config/routes/routes');
const PORTA = 3000; 

app.listen(PORTA, () => console.log(`API rodando na porta ${PORTA}`));
