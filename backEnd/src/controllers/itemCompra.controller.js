const ItensCompra = require('../models/ItensCompra')
const Compra = require('../models/Compra')
const Produto = require('../models/Produto')

const listarItensPorCompra = async (req, res) => {
    const idCompra = req.params.idCompra

    try {
        const itens = await ItensCompra.findAll({
            where: { idCompra },
            include: [
                { model: Compra, as: 'compraItem' },
                { model: Produto, as: 'produtoItemCompra' }
            ],
            order: [['codItemCompra', 'ASC']]
        })
        
        res.status(200).json(itens)
    } catch (err) {
        console.error('Erro ao listar itens da compra', err)
        res.status(500).json({ error: 'Erro ao listar itens da compra' })
    }
}

const atualizarItem = async (req, res) => {
    const id = req.params.id
    const { quantidade, custoUnitario } = req.body

    try {
        const item = await ItensCompra.findByPk(id, {
            include: [{ model: Compra, as: 'compraItem' }]
        })

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' })
        }

        // Verificar se compra permite alteração
        if (item.compraItem.statusCompra !== 'AGUARDANDO_NOTA') {
            return res.status(400).json({ message: 'Não é possível alterar itens de uma compra já processada' })
        }

        const dadosAtualizacao = {}
        if (quantidade !== undefined) {
            if (quantidade <= 0) {
                return res.status(400).json({ message: 'Quantidade deve ser maior que zero' })
            }
            dadosAtualizacao.quantidade = quantidade
        }

        if (custoUnitario !== undefined) {
            if (custoUnitario <= 0) {
                return res.status(400).json({ message: 'Custo unitário deve ser maior que zero' })
            }
            dadosAtualizacao.custoUnitario = custoUnitario
        }

        await ItensCompra.update(dadosAtualizacao, { where: { codItemCompra: id } })

        // Recalcular total da compra
        await recalcularTotalCompra(item.idCompra)

        const itemAtualizado = await ItensCompra.findByPk(id, {
            include: [
                { model: Compra, as: 'compraItem' },
                { model: Produto, as: 'produtoItemCompra' }
            ]
        })

        res.status(200).json(itemAtualizado)
    } catch (err) {
        console.error('Erro ao atualizar item da compra', err)
        res.status(500).json({ error: 'Erro ao atualizar item da compra' })
    }
}

const removerItem = async (req, res) => {
    const id = req.params.id

    try {
        const item = await ItensCompra.findByPk(id, {
            include: [{ model: Compra, as: 'compraItem' }]
        })

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' })
        }

        // Verificar se compra permite alteração
        if (item.compraItem.statusCompra !== 'AGUARDANDO_NOTA') {
            return res.status(400).json({ message: 'Não é possível remover itens de uma compra já processada' })
        }

        const idCompra = item.idCompra

        await ItensCompra.destroy({ where: { codItemCompra: id } })

        // Recalcular total da compra
        await recalcularTotalCompra(idCompra)

        res.status(200).json({ message: 'Item removido da compra com sucesso' })
    } catch (err) {
        console.error('Erro ao remover item da compra', err)
        res.status(500).json({ error: 'Erro ao remover item da compra' })
    }
}

// Função auxiliar para recalcular total da compra
async function recalcularTotalCompra(idCompra) {
    const itens = await ItensCompra.findAll({ where: { idCompra } })
    
    let valorTotal = 0
    for (const item of itens) {
        valorTotal += parseFloat(item.custoUnitario) * item.quantidade
    }

    await Compra.update(
        { valorTotal },
        { where: { codCompra: idCompra } }
    )
}

module.exports = {
    listarItensPorCompra,
    atualizarItem,
    removerItem
}