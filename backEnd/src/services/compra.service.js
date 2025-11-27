const Compra = require('../models/Compra')
const ItensCompra = require('../models/ItensCompra')
const Produto = require('../models/Produto')

async function criarCompra({ referenciaFornecedor, numeroDocumento, itens, idFornecedor }) {
    if (!referenciaFornecedor || !itens || !Array.isArray(itens) || itens.length === 0) {
        throw new Error('Dados da compra incompletos')
    }

    let valorTotal = 0
    const itensComCusto = []

    for (const item of itens) {
        const produto = await Produto.findByPk(item.idProduto)
        if (!produto) throw new Error(`Produto ${item.idProduto} não encontrado`)
        if (item.quantidade <= 0) throw new Error('Quantidade inválida')
        const custo = item.custoUnitario || 0
        const totalItem = custo * item.quantidade
        itensComCusto.push({ ...item, custoUnitario: custo, totalItem })
        valorTotal += totalItem
    }

    const compra = await Compra.create({ referenciaFornecedor, numeroDocumento, valorTotal, idFornecedor, statusCompra: 'AGUARDANDO_NOTA' })

    for (const it of itensComCusto) {
        await ItensCompra.create({ idCompra: compra.codCompra, idProduto: it.idProduto, quantidade: it.quantidade, custoUnitario: it.custoUnitario })
    }

    return compra
}

async function listarCompras() {
    return await Compra.findAll({ order: [['codCompra', 'DESC']] })
}

async function receberCompra(id, statusCompra) {
    const compra = await Compra.findByPk(id)
    if (!compra) throw new Error('Compra não encontrada')
    await compra.update({ statusCompra })
    return compra
}

async function buscarCompraPorId(id) {
    const compra = await Compra.findByPk(id, { include: [{ model: ItensCompra, as: 'itensDaCompra' }] })
    if (!compra) throw new Error('Compra não encontrada')
    return compra
}

module.exports = { criarCompra, listarCompras, receberCompra, buscarCompraPorId }
