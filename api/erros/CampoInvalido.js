class CampoInvalido extends Error {
  constructor (campo) {
    const mensagem = `Campo '${campo}' necessário`
    super(mensagem)
    this.name = 'Campo inválido'
    this.idErro = 1
  };
};

module.exports = CampoInvalido
