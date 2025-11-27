const ItemPedido = require('../models/ItemPedido')
const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')
const Estoque = require('../models/Estoque')

async function adicionarItem({ idPedido, idProduto, quantidade }) {
    if (!idPedido || !idProduto || !quantidade) throw new Error('Dados incompletos')

    const pedido = await Pedido.findByPk(idPedido)
    if (!pedido) throw new Error('Pedido não encontrado')

    const produto = await Produto.findByPk(idProduto)
    if (!produto) throw new Error('Produto não encontrado')

    if (!produto.ativo) throw new Error('Produto indisponível')

    // verificar estoque
    const estoque = await Estoque.findOne({ where: { idProduto } })
    if (!estoque || estoque.quantidade_atual < quantidade) throw new Error('Estoque insuficiente')

    const item = await ItemPedido.create({ idPedido, idProduto, quantidade, precoUnitario: produto.preco, valorTotalItem: produto.preco * quantidade })
    return item
}

async function atualizarQuantidade(id, quantidade) {
    const item = await ItemPedido.findByPk(id)
    if (!item) throw new Error('Item não encontrado')
    if (quantidade <= 0) throw new Error('Quantidade inválida')
    await item.update({ quantidade, valorTotalItem: item.precoUnitario * quantidade })
    return item
}

async function removerItem(id) {
    const item = await ItemPedido.findByPk(id)
    if (!item) throw new Error('Item não encontrado')
    await item.destroy()
    return true
}

async function listarItensPorPedido(idPedido) {
    return await ItemPedido.findAll({ where: { idPedido }, include: [{ model: Produto, as: 'produtoItem' }], order: [['codItemPedido', 'ASC']] })
}

module.exports = { adicionarItem, atualizarQuantidade, removerItem, listarItensPorPedido }
