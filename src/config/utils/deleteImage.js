const { s3Client, DeleteObjectCommand } = require('../lib/aws');

const extrairNomeArquivo = (imagemUrl) => {
  const lastSlashIndex = imagemUrl.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    throw new Error('URL da imagem inválida.')
  }
  return imagemUrl.substring(lastSlashIndex + 1)
}

const excluirImagemDoProduto = async (imagemUrl) => {
  try {
    const fileName = extrairNomeArquivo(imagemUrl)

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.KEY_NAME_BUCKET,
      Key: `produtos/${fileName}`
    })

    await s3Client.send(deleteCommand)

    return

  } catch (error) {
    console.error('Erro ao excluir imagem do produto:', error.message)
    throw new Error('Falha ao excluir imagem do produto.')
  }
}

module.exports = excluirImagemDoProduto;
