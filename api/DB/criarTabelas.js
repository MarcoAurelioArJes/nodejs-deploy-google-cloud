const modelos = [
  require('../rotas/fornecedores/ModeloTabelaFornecedor'),
  require('../rotas/fornecedores/produtos/ModeloTabelaProdutos')
]

// sync sincroniza as configurações, e ele retorna uma promise
/* ModeloTabela.sync()
            .then(() => console.log('Tabela criada com sucesso!!!'))
            .catch(console.log) */

function criarTabelas () {
  modelos.forEach(ModeloTabela => {
    ModeloTabela.sync()
  })
/*     for (let i = 0; i < 0; i++) {
        const modelo = modelos[i];
        await modelo.sync();
    }; */
};

criarTabelas()
