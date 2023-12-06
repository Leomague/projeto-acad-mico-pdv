const deploy = async (req, res) => {
  return res.json({ mensagem: 'Deploy funcionando!' })
}

module.exports = {
  deploy
}