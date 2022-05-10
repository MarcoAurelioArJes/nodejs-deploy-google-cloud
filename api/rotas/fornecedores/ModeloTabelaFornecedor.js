const Sequelize = require('sequelize')
const connectSeq = require('../../DB/connection')

// Criando uma tabela pelo Sequelize definindo as colunas
const colunas = {
  // Nome da empresa
  empresa: {
    // type = TIPO, allowNull = Aceita nulo,
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  categoria: {
    type: Sequelize.ENUM('ração', 'brinquedos'),
    allowNull: false
  }
}

// freezeTableName = Não pode mudar o nome da tabela, tableName: 'fornecedores'
// tableName é diferente do nome definido no código
// TimeStamp = define o tempo na nossa tabela só que os valores vem em inglês
// por isso definimos a 'dataCriacao', 'dataAtualizacao' e a 'versao'
const opcoes = {
  freezeTableName: true,
  tableName: 'fornecedores',
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao',
  version: 'versao'
}

// define() define a tabela o primeiro parâmetro define o nome, o segundo define as
// colunas da tabela e o terceiro define as opcoes
module.exports = connectSeq.define('fornecedores', colunas, opcoes)
