const ProdutoFornecedor = require('../models/ProdutoFornecedor')
const Produto = require('../models/Produto')
const Fornecedor = require('../models/Fornecedor')

async function vincularProdutoFornecedor({ idProduto, idFornecedor, custoUnitarioAtual, codigoReferencia }) {
    const produto = await Produto.findByPk(idProduto)
    if (!produto) throw new Error('Produto não encontrado')
    const fornecedor = await Fornecedor.findByPk(idFornecedor)
    if (!fornecedor) throw new Error('Fornecedor não encontrado')

    const existente = await ProdutoFornecedor.findOne({ where: { idProduto, idFornecedor } })
    if (existente) throw new Error('Vínculo já existe')

    const vinculo = await ProdutoFornecedor.create({ idProduto, idFornecedor, custoUnitarioAtual, codigoReferencia })
    return vinculo
}

async function listarFornecedoresDoProduto(idProduto) {
    return await ProdutoFornecedor.findAll({ where: { idProduto }, include: [{ model: Fornecedor, as: 'fornecedorDoProduto' }] })
}

async function listarProdutosDoFornecedor(idFornecedor) {
    return await ProdutoFornecedor.findAll({ where: { idFornecedor }, include: [{ model: Produto, as: 'produtoNoFornecedor' }] })
}

async function atualizarCusto(id, custoUnitarioAtual) {
    const pf = await ProdutoFornecedor.findByPk(id)
    if (!pf) throw new Error('Vínculo não encontrado')
    await pf.update({ custoUnitarioAtual })
    return pf
}

async function removerVinculo(id) {
    const pf = await ProdutoFornecedor.findByPk(id)
    if (!pf) throw new Error('Vínculo não encontrado')
    await pf.destroy()
    return true
}

module.exports = { vincularProdutoFornecedor, listarFornecedoresDoProduto, listarProdutosDoFornecedor, atualizarCusto, removerVinculo }
