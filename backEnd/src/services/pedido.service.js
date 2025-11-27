const Pedido = require('../models/Pedido')
const ItemPedido = require('../models/ItemPedido')
const Produto = require('../models/Produto')

async function criarPedido({ idUsuario, idEndereco, itens, metodoPagamento }) {
    if (!idUsuario || !idEndereco || !itens || !Array.isArray(itens) || itens.length === 0) throw new Error('Dados do pedido incompletos')

    let valorSubtotal = 0
    const itensComPreco = []

    for (const item of itens) {
        const produto = await Produto.findByPk(item.idProduto)
        if (!produto) throw new Error(`Produto ${item.idProduto} não encontrado`)
        if (!produto.ativo) throw new Error('Produto não disponível')
        const precoUnitario = produto.preco
        const valorTotalItem = precoUnitario * item.quantidade
        itensComPreco.push({ ...item, precoUnitario, valorTotalItem })
        valorSubtotal += valorTotalItem
    }

    const valorFrete = valorSubtotal > 100 ? 0 : 15.00
    const valorTotal = valorSubtotal + valorFrete

    const pedido = await Pedido.create({ idUsuario, idEndereco, valorSubtotal, valorFrete, valorTotal, metodoPagamento, status: 'PENDENTE_PAGAMENTO' })

    for (const item of itensComPreco) {
        await ItemPedido.create({ idPedido: pedido.codPedido, idProduto: item.idProduto, quantidade: item.quantidade, precoUnitario: item.precoUnitario, valorTotalItem: item.valorTotalItem })
    }

    return pedido
}

async function listarPedidosUsuario(idUsuario) {
    return await Pedido.findAll({ where: { idUsuario }, order: [['dataPedido', 'DESC']] })
}

async function buscarPedidoPorId(id, idUsuario) {
    const pedido = await Pedido.findOne({ where: { codPedido: id, idUsuario } })
    if (!pedido) throw new Error('Pedido não encontrado')
    return pedido
}

async function atualizarStatus(id, status) {
    const pedido = await Pedido.findByPk(id)
    if (!pedido) throw new Error('Pedido não encontrado')
    await pedido.update({ status })
    return pedido
}

module.exports = { criarPedido, listarPedidosUsuario, buscarPedidoPorId, atualizarStatus }
