const ModeloTabela = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {

  listar () {
    return ModeloTabela.findAll({ raw: true })
  },

  inserir (fornecedor) {
    return ModeloTabela.create(fornecedor)
  },

  async listaPorId (id) {
    // findOne para encontrar somente 1 dado
    // clausula where para encontrar o id escolhido
    const encontrado = await ModeloTabela.findOne({
      where: {
        id
      }
    })

    if (!encontrado) {
      throw new NaoEncontrado('Fornecedor')
    }

    return encontrado
  },

  async atualizar (id, dados) {
    return await ModeloTabela.update(
      dados, {
        where: { id }
      })
  },

  deletar (id) {
    return ModeloTabela.destroy({
      where: { id }
    })
  }
}
