const Pagamento = require('../models/Pagamento')
const Pedido = require('../models/Pedido')
const Compra = require('../models/Compra')

const criarPagamento = async (req, res) => {
    const { idPedido, idCompra, valor, metodo } = req.body
    
    // Deve ser para pedido OU compra, não ambos
    if ((!idPedido && !idCompra) || (idPedido && idCompra)) {
        return res.status(400).json({message: "Informe apenas idPedido OU idCompra"})
    }

    if (!valor || valor <= 0) {
        return res.status(400).json({message: "Valor deve ser maior que zero"})
    }

    const metodosValidos = ['CARTAO_CREDITO', 'PIX', 'BOLETO', 'TRANSFERENCIA', 'DEBITO']
    if (!metodosValidos.includes(metodo)) {
        return res.status(400).json({message: "Método de pagamento inválido"})
    }

    try {
        // Verificar se pedido/compra existe
        if (idPedido) {
            const pedido = await Pedido.findByPk(idPedido)
            if (!pedido) {
                return res.status(404).json({message: 'Pedido não encontrado'})
            }
        }

        if (idCompra) {
            const compra = await Compra.findByPk(idCompra)
            if (!compra) {
                return res.status(404).json({message: 'Compra não encontrada'})
            }
        }

        const pagamento = await Pagamento.create({
            idPedido,
            idCompra,
            valor,
            metodo,
            status: 'PENDENTE'
        })

        res.status(201).json(pagamento)
    } catch (err) {
        console.error('Erro ao criar pagamento', err)
        res.status(500).json({error: 'Erro ao criar pagamento', err})
    }
}

const atualizarStatusPagamento = async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    const statusValidos = ['PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO']
    if (!statusValidos.includes(status)) {
        return res.status(400).json({message: "Status inválido"})
    }

    try {
        const pagamento = await Pagamento.findByPk(id)
        if (pagamento) {
            await Pagamento.update({ status }, { where: { codPagamento: id } })

            // Se pagamento aprovado e for de pedido, atualizar status do pedido
            if (status === 'APROVADO' && pagamento.idPedido) {
                await Pedido.update(
                    { status: 'PAGO' }, 
                    { where: { codPedido: pagamento.idPedido } }
                )
            }

            res.status(200).json({message: 'Status do pagamento atualizado'})
        } else {
            res.status(404).json({message: 'Pagamento não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar status do pagamento', err)
        res.status(500).json({error: 'Erro ao atualizar status do pagamento', err})
    }
}

const listarPagamentosPedido = async (req, res) => {
    const idPedido = req.params.idPedido

    try {
        const pagamentos = await Pagamento.findAll({
            where: { idPedido },
            include: [{ model: Pedido, as: 'pedidoPagamento' }],
            order: [['dataPagamento', 'DESC']]
        })
        
        res.status(200).json(pagamentos)
    } catch (err) {
        console.error('Erro ao listar pagamentos do pedido', err)
        res.status(500).json({error: 'Erro ao listar pagamentos do pedido', err})
    }
}

const listarPagamentosCompra = async (req, res) => {
    const idCompra = req.params.idCompra

    try {
        const pagamentos = await Pagamento.findAll({
            where: { idCompra },
            include: [{ model: Compra, as: 'compraPagamento' }],
            order: [['dataPagamento', 'DESC']]
        })
        
        res.status(200).json(pagamentos)
    } catch (err) {
        console.error('Erro ao listar pagamentos da compra', err)
        res.status(500).json({error: 'Erro ao listar pagamentos da compra', err})
    }
}

module.exports = {
    criarPagamento,
    atualizarStatusPagamento,
    listarPagamentosPedido,
    listarPagamentosCompra
}

