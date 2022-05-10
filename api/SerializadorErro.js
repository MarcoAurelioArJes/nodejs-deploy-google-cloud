const Serializador = require('./Serializador').Serializador

class SerializadorErro extends Serializador {
  constructor (contentType, camposExtras) {
    super()
    this.contentType = contentType
    this.campos = ['id', 'mensagem'].concat(camposExtras || [])
    this.tagSingular = 'erro'
    this.tagPlural = 'erros'
  };
};

module.exports = {
  SerializadorErro
}
