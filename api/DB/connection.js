const Sequelize = require('sequelize')

const connectSeq = new Sequelize(
  'petshop',
  'root',
  '85245655',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
)

module.exports = connectSeq
