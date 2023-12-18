const express = require('express');
const rotas = require('./config/routes/routes');

const app = express();

app.use(express.json());

app.use(rotas);

const listarCategorias = async (req, res) => {
    return res.json({ mensagem: 'Tudo certo' })
    try {
      const query = 'SELECT * FROM usuarios';
      const resultado = await pool.query(query);
      const categorias = resultado.rows;
  
      if (categorias.length > 0) {
        return res.status(200).json(categorias);
      } else {
        return res.status(204).send();
      }
    } catch (error) {
      return res.status(400).json({ mensagem: 'Erro na solicitação' });
    }
  };

  module.exports = 
    listarCategorias
