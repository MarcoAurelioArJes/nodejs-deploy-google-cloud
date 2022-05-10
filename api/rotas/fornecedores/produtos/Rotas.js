const Routes = require('express').Router({ mergeParams: true })

const TabelaProduto = require('./TabelaProduto')

const Produtos = require('./Produtos')

const Serializador = require('../../../SerializadorProduto')

Routes.get('/', async (req, res) => {
  const produto = await TabelaProduto.listar(req.fornecedor.id)
  const serializador = new Serializador(
    res.getHeader('Content-Type')
  )
  res.send(
    serializador.serializar(produto)
  )
})

Routes.post('/', async (req, res, next) => {
  try {
    const idFornec = req.fornecedor.id
    const body = req.body
    const dados = Object.assign({}, body, { fornecedor: idFornec })
    console.log(body)
    const ProdutosInstance = new Produtos(dados)
    await ProdutosInstance.criar()

    const serializador = new Serializador(
      res.getHeader('Content-Type'),
      ['preco', 'estoque', 'fornecedor',
        'dataAtualizacao', 'dataCriacao', 'versao']
    )

    res.set('ETag', ProdutosInstance.versao)
    const timestamp = (new Date(ProdutosInstance.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.set('Location', `api/fornecedores/${ProdutosInstance.fornecedor}/produtos/${ProdutosInstance.id}`)
    res.status(201)
    res.send(
      serializador.serializar(ProdutosInstance)
    )
  } catch (error) {
    next(error)
  }
})

Routes.delete('/:idProd', async (req, res) => {
  const idProd = req.params.idProd
  const idFornec = req.fornecedor.id
  const ProdutosInstance = new Produtos({ id: idProd, fornecedor: idFornec })
  await ProdutosInstance.deletar()

  res.status(201)
  res.end()
})

Routes.get('/:idProd', async (req, res, next) => {
  try {
    const dados = {
      id: req.params.idProd,
      fornecedor: req.fornecedor.id
    }

    const produto = new Produtos(dados)
    await produto.listarPorId()

    const serializador = new Serializador(
      res.getHeader('Content-Type'),
      ['preco', 'estoque', 'fornecedor',
        'dataAtualizacao', 'dataCriacao', 'versao']
    )

    res.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)

    res.status(200)
    res.send(
      serializador.serializar(produto)
    )
  } catch (error) {
    next(error)
  }
})

Routes.head('/:idProd', async (req, res, next) => {
  try {
    const dados = {
      id: req.params.idProd,
      fornecedor: req.fornecedor.id
    }

    const produto = new Produtos(dados)
    await produto.listarPorId()

    res.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)

    console.log(produto)
    res.status(200)
    res.end()
  } catch (error) {
    next(error)
  }
})

Routes.put('/:idProd', async (req, res, next) => {
  try {
    const dados = Object.assign(
      {},
      req.body,
      {
        id: req.params.idProd,
        fornecedor: req.fornecedor.id
      }
    )

    const produto = new Produtos(dados)
    await produto.atualizar()
    await produto.listarPorId()

    res.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.status(204)
    res.end()
  } catch (error) {
    next(error)
  }
})

Routes.post('/:idProd/diminuir-estoque', async (req, res, next) => {
  try {
    const dados = {
      id: req.params.idProd,
      fornecedor: req.fornecedor.id
    }

    const produto = new Produtos(dados)

    await produto.listarPorId()

    produto.estoque = produto.estoque - req.body.quantidade

    await produto.diminuirEstoque()
    await produto.listarPorId()

    res.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    res.status(204)
    res.end()
  } catch (error) {
    next(error)
  };
})

module.exports = Routes
