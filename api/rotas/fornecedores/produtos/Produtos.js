const TabelaProduto = require('./TabelaProduto')
const CampoInvalido = require('../../../erros/CampoInvalido')
const SemDadosParaAtt = require('../../../erros/SemDadosParaAtt')

class Produtos {
  constructor ({
    id, titulo, preco, estoque, fornecedor,
    dataAtualizacao, dataCriacao, versao
  }) {
    this.id = id
    this.titulo = titulo
    this.preco = preco
    this.estoque = estoque
    this.fornecedor = fornecedor
    this.dataAtualizacao = dataAtualizacao
    this.dataCriacao = dataCriacao
    this.versao = versao
  };

  valida () {
    if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
      throw new CampoInvalido('titulo')
    }

    if (typeof this.preco !== 'number' || this.preco === 0) {
      throw new CampoInvalido('preco')
    }
  };

  async criar () {
    this.valida()
    const dados = await TabelaProduto.criar({
      titulo: this.titulo,
      preco: this.preco,
      estoque: this.estoque,
      fornecedor: this.fornecedor
    })

    this.id = dados.id
    this.dataAtualizacao = dados.dataAtualizacao
    this.dataCriacao = dados.dataCriacao
    this.versao = dados.versao
  };

  async deletar () {
    await TabelaProduto.deletar(this.id, this.fornecedor)
  };

  async listarPorId () {
    const produto = await TabelaProduto.listarPorId(this.id, this.fornecedor)
    this.titulo = produto.titulo
    this.preco = produto.preco
    this.estoque = produto.estoque
    this.dataAtualizacao = produto.dataAtualizacao
    this.dataCriacao = produto.dataCriacao
    this.versao = produto.versao
  };

  async atualizar () {
    const dadosParaAtualizar = {}
    const produtoAtualizar = {
      id: this.id,
      fornecedor: this.fornecedor
    }

    if (typeof this.titulo === 'string' && this.titulo.length > 0) {
      dadosParaAtualizar.titulo = this.titulo
    };

    if (typeof this.preco === 'number' && this.preco > 0) {
      dadosParaAtualizar.preco = this.preco
    };

    if (typeof this.estoque === 'number' && this.estoque >= 0) {
      dadosParaAtualizar.estoque = this.estoque
    };

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new SemDadosParaAtt()
    };

    return await TabelaProduto.atualizar(
      dadosParaAtualizar,
      produtoAtualizar
    )
  };

  diminuirEstoque () {
    const dados = {
      id: this.id,
      fornecedor: this.fornecedor,
      campo: 'estoque',
      quantidade: this.estoque
    }

    return TabelaProduto.diminuirEstoque(dados)
  };
};

module.exports = Produtos
