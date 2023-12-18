const status200 = { mensagem: "Requisição bem sucedida" }
const status201 = { mensagem: "Ação concluída com sucesso: o recurso foi criado." };
const error400 = { mensagem: "Requisição inválida: verifique os dados fornecidos." };
const error401 = { mensagem: "Não autorizado." };
const error403 = { mensagem: "Acesso negado: você não tem permissão para acessar este recurso." };
const error404 = { mensagem: "O servidor não pode encontrar o recurso solicitado." };
const error500 = { mensagem: "Erro interno no servidor." };

module.exports = {
  status200,
  status201,
  error400,
  error401,
  error403,
  error404,
  error500
}
