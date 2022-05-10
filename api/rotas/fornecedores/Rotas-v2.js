const Routes = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../SerializadorFornecedor')
  .SerializadorFornecedor

Routes.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200)
  res.end()
})

Routes.get('/', async (req, res) => {
  const lista = await TabelaFornecedor.listar()
  const serializador = new SerializadorFornecedor(
    res.getHeader('Content-Type'),
    'categoria'
  )

  res.set('X-Powered-By', 'Gatito')
  res.status(200)
  res.send(serializador.serializar(lista))
})

Routes.post('/', async (req, res, next) => {
  try {
    const dadosFornec = req.body
    const fornecedor = new Fornecedor(dadosFornec)
    await fornecedor.cria()
    const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type'))

    res.set('ETag', fornecedor.versao)
    const timestamp = (new Date(fornecedor.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.set('Location', `/api/fornecedores/${fornecedor.id}`)
    res.set('X-Powered-By', 'Gatito')
    res.status(201)
    res.send(serializador.serializar(fornecedor))
  } catch (error) {
    next(error)
  }
})

module.exports = Routes
