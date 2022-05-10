const Routes = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../SerializadorFornecedor')
  .SerializadorFornecedor

const TabelaProduto = require('./produtos/TabelaProduto')

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
    ['empresa', 'categoria'])

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
      res.getHeader('Content-Type'),
      ['empresa', 'categoria'])

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

Routes.options('/:idFornec', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200)
  res.end()
})

Routes.get('/:idFornec', async (req, res, next) => {
  try {
    const id = req.params.idFornec
    const fornecedor = new Fornecedor({ id })
    await fornecedor.listaPorId()

    const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type'),
      ['email', 'empresa', 'categoria', 'dataCriacao', 'dataAtualizacao', 'versao'])

    res.set('ETag', fornecedor.versao)
    const timestamp = (new Date(fornecedor.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.set('X-Powered-By', 'Gatito')
    res.status(200)
    res.send(serializador.serializar(fornecedor))
  } catch (error) {
    next(error)
  }
})

Routes.put('/:idFornec', async (req, res, next) => {
  try {
    const id = req.params.idFornec
    const dadosAttFornec = req.body
    // Object.assign funciona como o spred operator
    const dadosParaAtt = Object.assign({}, dadosAttFornec, { id })

    const fornec = new Fornecedor(dadosParaAtt)

    await fornec.atualizar()
    await fornec.listaPorId()

    res.set('ETag', fornec.versao)
    const timestamp = (new Date(fornec.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.set('X-Powered-By', 'Gatito')
    res.status(204)
    res.end()
  } catch (error) {
    next(error)
  }
})

Routes.delete('/:idFornec', async (req, res) => {
  try {
    const id = req.params.idFornec
    const fornecedor = new Fornecedor({ id })
    await fornecedor.listaPorId()
    await fornecedor.deletar()

    res.set('X-Powered-By', 'Gatito')
    res.status(204)
    res.end()
  } catch (error) {
    res.status(404)
    res.json({ mensagem: error.message })
  }
})

Routes.options('/:idFornec/reposicao-estoque', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'POST')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200)
  res.end()
})

Routes.post('/:idFornec/reposicao-estoque', async (req, res, next) => {
  try {
    const fornecedor = new Fornecedor({ id: req.params.idFornec })
    await fornecedor.listaPorId()

    const produtos = await TabelaProduto.listar(fornecedor.id, { estoque: 0 })

    res.set('ETag', fornecedor.versao)
    const timestamp = (new Date(fornecedor.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.set('X-Powered-By', 'Gatito')
    res.status(200)
    res.send(
      JSON.stringify({ mensagem: `${produtos.length} produtos do fornecedor ${fornecedor.id}: ${fornecedor.empresa} precisam de reposição` })
    )
  } catch (error) {
    next(error)
  }
})

const Produtos = require('./produtos/Rotas')

// O next passa para exatamente como o nome já diz
// o próximo passo
const validaFornecedor = async (req, res, next) => {
  try {
    const id = req.params.idFornec
    const fornecedor = new Fornecedor({ id })
    await fornecedor.listaPorId()
    // Injetando o objeto fornecedor na requisição
    // sendo assim podemos utilizar esse objeto requisições seguintes
    req.fornecedor = fornecedor
    next()
  } catch (error) {
    next(error)
  }
}

Routes.use('/:idFornec/produtos', validaFornecedor, Produtos)

module.exports = Routes
