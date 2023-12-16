const listarCategorias = async (req, res) => {
    try {
      const query = 'SELECT nome FROM categorias';
      const resultado = await pool.query(query);
      const categorias = resultado.rows.map(row => row.nome);
  
      if (categorias.length > 0) {
        return res.status(200).json(categorias);
      } else {
        return res.status(204).send();
      }
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
  };
  
  module.exports = {
    listarCategorias
  };
  