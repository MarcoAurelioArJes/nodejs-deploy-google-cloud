const Serializador = require('./Serializador').Serializador

class SerializadorProduto extends Serializador {
  constructor (contentType, camposExtras) {
    super()
    this.contentType = contentType
    this.campos = ['id', 'titulo']
      .concat(camposExtras || [])
    this.tagSingular = 'produto'
    this.tagPlural = 'produtos'
  };
};

module.exports = SerializadorProduto
