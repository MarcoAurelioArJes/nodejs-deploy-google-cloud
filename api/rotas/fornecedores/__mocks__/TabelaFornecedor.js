module.exports = {

  listar () {
    return []
  },

  inserir (fornecedor) {
    return {
      id: 100,
      dataCriacao: '20/12/2000',
      dataAtualizacao: '20/12/2000',
      versao: 100
    }
  },

  async listaPorId (id) {
    return {
      id: 100,
      dataCriacao: '20/12/2000',
      dataAtualizacao: '20/12/2000',
      versao: 100
    }
  },

  async atualizar (id, dados) {

  },

  async deletar (id) {

  }
}
