const TabelaFornecedor = require('./TabelaFornecedor')
const CampoInvalido = require('../../erros/CampoInvalido')
const SemDadosParaAtt = require('../../erros/SemDadosParaAtt')

class Fornecedor {
  constructor ({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
    this.id = id
    this.empresa = empresa
    this.email = email
    this.categoria = categoria
    this.dataCriacao = dataCriacao
    this.dataAtualizacao = dataAtualizacao
    this.versao = versao
  };

  async cria () {
    this.valida()
    const resultado = await TabelaFornecedor.inserir({
      empresa: this.empresa,
      email: this.email,
      categoria: this.categoria
    })

    this.id = resultado.id
    this.dataCriacao = resultado.dataCriacao
    this.dataAtualizacao = resultado.dataAtualizacao
    this.versao = resultado.versao
  };

  async listaPorId () {
    const fornec = await TabelaFornecedor.listaPorId(this.id)
    this.empresa = fornec.empresa
    this.email = fornec.email
    this.categoria = fornec.categoria
    this.dataCriacao = fornec.dataCriacao
    this.dataAtualizacao = fornec.dataAtualizacao
    this.versao = fornec.versao
  };

  async atualizar () {
    await TabelaFornecedor.listaPorId(this.id)
    const campos = ['empresa', 'email', 'categoria']
    const dadosParaAtt = {}

    campos.forEach((campo) => {
      const valor = this[campo]
      if (typeof valor === 'string' && valor.length > 0) {
        dadosParaAtt[campo] = valor
      }
    })

    if (Object.keys(dadosParaAtt).length === 0) {
      throw new SemDadosParaAtt()
    }

    await TabelaFornecedor.atualizar(this.id, dadosParaAtt)
  }

  deletar () {
    return TabelaFornecedor.deletar(this.id)
  }

  valida () {
    const campos = ['empresa', 'email', 'categoria']

    campos.forEach(campo => {
      const valor = this[campo]

      if (typeof valor !== 'string' || valor.length === 0) {
        throw new CampoInvalido(campo)
      };
    })

    return true
  }
};

module.exports = Fornecedor
