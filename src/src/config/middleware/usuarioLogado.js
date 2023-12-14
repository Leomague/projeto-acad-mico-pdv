const usuarioLogado = async (req, res, next) => {
  //validar token do usuario logado
  return res.json('ok')
}

module.exports = {
  usuarioLogado
}
