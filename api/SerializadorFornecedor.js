const Serializador = require('./Serializador').Serializador

class SerializadorFornecedor extends Serializador {
  constructor (contentType, camposExtras) {
    super()
    this.contentType = contentType
    this.campos = ['id'].concat(camposExtras || [])
    this.tagSingular = 'fornecedor'
    this.tagPlural = 'fornecedores'
  };
};

module.exports = {
  SerializadorFornecedor
}
