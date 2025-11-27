const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')

async function cadastrar({ idProduto, quantidade_atual = 0, quantidade_minima = 0 }) {
    const produto = await Produto.findByPk(idProduto)
    if (!produto) throw new Error('Produto não encontrado')

    const existente = await Estoque.findOne({ where: { idProduto } })
    if (existente) throw new Error('Estoque já cadastrado para este produto')

    const estoque = await Estoque.create({ idProduto, quantidade_atual, quantidade_minima })
    return estoque
}

async function listar() {
    return await Estoque.findAll({ include: [{ model: Produto, as: 'produtoEstoque' }], order: [['idProduto', 'ASC']] })
}

async function buscarPorProduto(idProduto) {
    const estoque = await Estoque.findOne({ where: { idProduto }, include: [{ model: Produto, as: 'produtoEstoque' }] })
    if (!estoque) throw new Error('Estoque não encontrado')
    return estoque
}

async function atualizar(id, dados) {
    const estoque = await Estoque.findByPk(id)
    if (!estoque) throw new Error('Estoque não encontrado')
    await estoque.update(dados)
    return estoque
}

module.exports = { cadastrar, listar, buscarPorProduto, atualizar }
