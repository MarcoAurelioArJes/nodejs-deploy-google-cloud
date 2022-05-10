jest.mock('../../../api/rotas/fornecedores/TabelaFornecedor.js')
const Fornecedor = require('../../../api/rotas/fornecedores/Fornecedor')

describe('class Fornecedor', () => {
  test('Testando a função validar()', () => {
    const fornecedor = new Fornecedor({
      empresa: 'Gatito',
      email: 'contato@gatito.com.br',
      categoria: 'brinquedos'
    })
    expect(fornecedor.valida()).toBe(true)
  })

  test('Testando a função cria()', async () => {
    const fornecedor = new Fornecedor({
      empresa: 'Gatito',
      email: 'contato@gatito.com.br',
      categoria: 'brinquedos'
    })

    await fornecedor.cria()
    expect(fornecedor.id).toBe(100)
    expect(fornecedor.dataCriacao).toBe('20/12/2000')
    expect(fornecedor.dataAtualizacao).toBe('20/12/2000')
    expect(fornecedor.versao).toBe(100)
  })
})
