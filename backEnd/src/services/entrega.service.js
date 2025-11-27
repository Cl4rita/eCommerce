const Entrega = require('../models/Entrega')
const Pedido = require('../models/Pedido')

async function criarEntrega({ idPedido, dataEstimada, transportadora, codigoRastreio }) {
    if (!idPedido) throw new Error('ID do pedido é obrigatório')

    const pedido = await Pedido.findByPk(idPedido)
    if (!pedido) throw new Error('Pedido não encontrado')

    const existente = await Entrega.findOne({ where: { idPedido } })
    if (existente) throw new Error('Entrega já cadastrada para este pedido')

    const entrega = await Entrega.create({ idPedido, dataEstimada, transportadora, codigoRastreio, statusEntrega: 'AGUARDANDO_ENVIO' })

    // opcional: atualizar status do pedido aqui
    return entrega
}

async function atualizarStatusEntrega(id, statusEntrega, dataEntrega) {
    const entrega = await Entrega.findByPk(id)
    if (!entrega) throw new Error('Entrega não encontrada')
    await entrega.update({ statusEntrega, dataEntrega })
    return entrega
}

async function buscarEntregaPorPedido(idPedido) {
    const entrega = await Entrega.findOne({ where: { idPedido } })
    if (!entrega) throw new Error('Entrega não encontrada')
    return entrega
}

async function atualizarCodigoRastreio(id, codigoRastreio) {
    const entrega = await Entrega.findByPk(id)
    if (!entrega) throw new Error('Entrega não encontrada')
    await entrega.update({ codigoRastreio })
    return entrega
}

module.exports = { criarEntrega, atualizarStatusEntrega, buscarEntregaPorPedido, atualizarCodigoRastreio }
