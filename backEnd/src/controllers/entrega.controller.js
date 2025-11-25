// entrega.controller.js
const Entrega = require('../models/Entrega')
const Pedido = require('../models/Pedido')

const criarEntrega = async (req, res) => {
    const { idPedido, dataEstimada, transportadora, codigoRastreio } = req.body
    
    if (!idPedido) {
        return res.status(400).json({message: "ID do pedido é obrigatório"})
    }

    try {
        // Verificar se pedido existe
        const pedido = await Pedido.findByPk(idPedido)
        if (!pedido) {
            return res.status(404).json({message: 'Pedido não encontrado'})
        }

        // Verificar se já existe entrega para este pedido
        const entregaExistente = await Entrega.findOne({ where: { idPedido } })
        if (entregaExistente) {
            return res.status(400).json({message: 'Já existe uma entrega para este pedido'})
        }

        const entrega = await Entrega.create({
            idPedido,
            dataEstimada,
            transportadora,
            codigoRastreio,
            statusEntrega: 'AGUARDANDO_ENVIO'
        })

        // Atualizar status do pedido
        await Pedido.update(
            { status: 'SEPARACAO_ESTOQUE' }, 
            { where: { codPedido: idPedido } }
        )

        res.status(201).json(entrega)
    } catch (err) {
        console.error('Erro ao criar entrega', err)
        res.status(500).json({error: 'Erro ao criar entrega', err})
    }
}

const atualizarStatusEntrega = async (req, res) => {
    const id = req.params.id
    const { statusEntrega, dataEntrega } = req.body

    const statusValidos = ['AGUARDANDO_ENVIO', 'EM_TRANSITO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'EXTRAVIADO', 'DEVOLVIDO']
    if (!statusValidos.includes(statusEntrega)) {
        return res.status(400).json({message: "Status de entrega inválido"})
    }

    try {
        const entrega = await Entrega.findByPk(id)
        if (entrega) {
            const dadosAtualizacao = { statusEntrega }
            
            // Se marcando como entregue, registrar data de entrega
            if (statusEntrega === 'ENTREGUE' && !entrega.dataEntrega) {
                dadosAtualizacao.dataEntrega = dataEntrega || new Date()
                
                // Atualizar status do pedido para ENTREGUE
                await Pedido.update(
                    { status: 'ENTREGUE' }, 
                    { where: { codPedido: entrega.idPedido } }
                )
            }

            await Entrega.update(dadosAtualizacao, { where: { codEntrega: id } })
            res.status(200).json({message: 'Status da entrega atualizado'})
        } else {
            res.status(404).json({message: 'Entrega não encontrada'})
        }
    } catch (err) {
        console.error('Erro ao atualizar status da entrega', err)
        res.status(500).json({error: 'Erro ao atualizar status da entrega', err})
    }
}

const buscarEntregaPorPedido = async (req, res) => {
    const idPedido = req.params.idPedido

    try {
        const entrega = await Entrega.findOne({
            where: { idPedido },
            include: [{ model: Pedido, as: 'pedidoEntrega' }]
        })
        
        if (entrega) {
            res.status(200).json(entrega)
        } else {
            res.status(404).json({message: 'Entrega não encontrada para este pedido'})
        }
    } catch (err) {
        console.error('Erro ao buscar entrega', err)
        res.status(500).json({error: 'Erro ao buscar entrega', err})
    }
}

const atualizarCodigoRastreio = async (req, res) => {
    const id = req.params.id
    const { codigoRastreio } = req.body

    if (!codigoRastreio) {
        return res.status(400).json({message: "Código de rastreio é obrigatório"})
    }

    try {
        const entrega = await Entrega.findByPk(id)
        if (entrega) {
            await Entrega.update(
                { codigoRastreio, statusEntrega: 'EM_TRANSITO' }, 
                { where: { codEntrega: id } }
            )

            // Atualizar status do pedido para ENVIADO
            await Pedido.update(
                { status: 'ENVIADO' }, 
                { where: { codPedido: entrega.idPedido } }
            )

            res.status(200).json({message: 'Código de rastreio atualizado'})
        } else {
            res.status(404).json({message: 'Entrega não encontrada'})
        }
    } catch (err) {
        console.error('Erro ao atualizar código de rastreio', err)
        res.status(500).json({error: 'Erro ao atualizar código de rastreio', err})
    }
}

module.exports = {
    criarEntrega,
    atualizarStatusEntrega,
    buscarEntregaPorPedido,
    atualizarCodigoRastreio
}