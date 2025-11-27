const Pagamento = require('../models/Pagamento')
const Pedido = require('../models/Pedido')
const Compra = require('../models/Compra')

async function criarPagamento({ idPedido, idCompra, valor, metodo }) {
    if ((!idPedido && !idCompra) || (idPedido && idCompra)) throw new Error('Informe apenas idPedido OU idCompra')
    if (!valor || valor <= 0) throw new Error('Valor inválido')

    const pagamento = await Pagamento.create({ idPedido, idCompra, valor, metodo, status: 'PENDENTE' })
    return pagamento
}

async function atualizarStatusPagamento(id, status) {
    const pg = await Pagamento.findByPk(id)
    if (!pg) throw new Error('Pagamento não encontrado')
    await pg.update({ status })
    return pg
}

async function listarPagamentosPedido(idPedido) {
    return await Pagamento.findAll({ where: { idPedido }, order: [['codPagamento', 'ASC']] })
}

async function listarPagamentosCompra(idCompra) {
    return await Pagamento.findAll({ where: { idCompra }, order: [['codPagamento', 'ASC']] })
}

module.exports = { criarPagamento, atualizarStatusPagamento, listarPagamentosPedido, listarPagamentosCompra }
