const Serializador = require('./Serializador').Serializador

class SerializadorUsuario extends Serializador {
  constructor (contentType) {
    super()
    this.contentType = contentType
    this.campos = ['nome']
  };
};

module.exports = {
  SerializadorUsuario
}
