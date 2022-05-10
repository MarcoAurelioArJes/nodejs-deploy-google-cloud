const ModeloTabelaProduto = require('./ModeloTabelaProdutos')

const NaoEncontrado = require('../../../erros/NaoEncontrado')

const connectSeq = require('../../../DB/connection')

// Nosso DAO para poder fazer o acesso ao nosso BD
module.exports = {

  listar (idFornec, criterios = {}) {
    criterios.fornecedor = idFornec

    return ModeloTabelaProduto.findAll({
      where: criterios,
      raw: true
    })
  },

  criar (dados) {
    return ModeloTabelaProduto.create(dados)
  },

  deletar (idProd, idFornec) {
    return ModeloTabelaProduto.destroy({
      where: {
        id: idProd,
        fornecedor: idFornec
      }
    })
  },

  async listarPorId (id, fornecedor) {
    const encontrado = await ModeloTabelaProduto.findOne({
      where: {
        id,
        fornecedor
      },
      raw: true
    })

    if (!encontrado) {
      throw new NaoEncontrado('Produto')
    };

    return encontrado
  },

  async atualizar (dadosParaAtualizar, produtoAtualizar) {
    return await ModeloTabelaProduto.update(
      dadosParaAtualizar,
      {
        where: produtoAtualizar
      }
    )
  },
  diminuirEstoque (dados) {
    return connectSeq.transaction(async transacao => {
      const produto = await ModeloTabelaProduto.findOne({
        where: {
          id: dados.id,
          fornecedor: dados.fornecedor
        }
      })

      produto[dados.campo] = dados.quantidade

      await produto.save()

      return produto
    })
  }
}
