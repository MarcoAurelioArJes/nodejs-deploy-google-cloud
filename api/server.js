const express = require('express')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const SemDadosParaAtt = require('./erros/SemDadosParaAtt')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./SerializadorErro').SerializadorErro
// Instância do express e porta
const app = express()

// Importando config
const config = require('config')

// Definindo os tipos de dados que nossa api poderá receber
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  let formatReq = req.header('Accept')

  if (formatReq === '*/*') {
    formatReq = 'application/json'
  };

  if (formatosAceitos.indexOf(formatReq) === -1) {
    // 406 Not Accetpable
    res.status(406)
    res.end()
    return
  };

  res.set('X-Powered-By', 'Gatito')
  // Configurando o cabeçalho da requisição
  // Indo para o próximo middleware
  res.setHeader('Content-Type', formatReq)
  next()
})

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

const Fornecedores = require('./rotas/fornecedores/Rotas')

// Consumindo o arquivo de fornecedores
app.use('/api/fornecedores', Fornecedores)

const FornecedoresV2 = require('./rotas/fornecedores/Rotas-v2')

// Consumindo o arquivo de fornecedores
app.use('/api/v2/fornecedores', FornecedoresV2)

app.use((error, req, res, next) => {
  let status = 500

  if (error instanceof NaoEncontrado) {
    status = 404
  }
  if (error instanceof CampoInvalido || error instanceof SemDadosParaAtt) {
    status = 400
  }

  if (error instanceof ValorNaoSuportado) {
    status = 406
  };
  const serializador = new SerializadorErro(
    res.getHeader('Content-Type')
  )

  res.status(status)
  res.send(
    serializador.serializar(
      {
        id: error.idErro,
        mensagem: error.message
      }
    )
  )
})

app.listen(config.get('api.porta'), () => {
  console.log(`API IS RUNNING ON PORT ${config.get('api.porta')}`)
})
