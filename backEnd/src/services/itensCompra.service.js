const ItensCompra = require('../models/ItensCompra')
const Compra = require('../models/Compra')

async function listarItensPorCompra(idCompra) {
    return await ItensCompra.findAll({ where: { idCompra }, include: [{ model: Compra, as: 'compraItem' }], order: [['codItemCompra', 'ASC']] })
}

async function atualizarItem(id, dados) {
    const item = await ItensCompra.findByPk(id)
    if (!item) throw new Error('Item não encontrado')
    await item.update(dados)
    return item
}

async function removerItem(id) {
    const item = await ItensCompra.findByPk(id)
    if (!item) throw new Error('Item não encontrado')
    await item.destroy()
    return true
}

module.exports = { listarItensPorCompra, atualizarItem, removerItem }
