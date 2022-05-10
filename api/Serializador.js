const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

const jsontoxml = require('jsontoxml')

// Template method
class Serializador {
  json (dados) {
    return JSON.stringify(dados)
  };

  xml (dados) {
    let tag = this.tagSingular

    if (Array.isArray(dados)) {
      tag = this.tagPlural
      dados = dados.map(item => {
        return {
          [this.tagSingular]: item
        }
      })
    };

    return jsontoxml({ [tag]: dados })
  };

  serializar (dados) {
    dados = this.filtrar(dados)
    if (this.contentType === 'application/json') {
      return this.json(dados)
    };

    if (this.contentType === 'application/xml') {
      return this.xml(dados)
    };

    throw new ValorNaoSuportado(this.contentType)
  };

  filtarObjeto (dados) {
    const novoObjeto = {}

    this.campos.forEach(campo => {
      if (Reflect.has(dados, campo)) {
        novoObjeto[campo] = dados[campo]
      };
    })

    return novoObjeto
  };

  filtrar (dados) {
    if (Array.isArray(dados)) {
      dados = dados.map(item => {
        return this.filtarObjeto(item)
      })
    } else {
      dados = this.filtarObjeto(dados)
    }

    return dados
  };
};

module.exports = {
  Serializador,
  formatosAceitos: ['application/json', 'application/xml']
}
