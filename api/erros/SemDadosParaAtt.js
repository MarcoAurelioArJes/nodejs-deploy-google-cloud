class SemDadosParaAtt extends Error {
  constructor () {
    super('Não foi informado dados para atualizar')
    this.name = 'Sem Dados Para Atualizar'
    this.idErro = 2
  };
};

module.exports = SemDadosParaAtt
