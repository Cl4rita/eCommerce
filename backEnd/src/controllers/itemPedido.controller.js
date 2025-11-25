const ItemPedido = require('../models/ItemPedido')
const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')
const Estoque = require('../models/Estoque')

const adicionarItem = async (req, res) => {
    const { idPedido, idProduto, quantidade } = req.body
    
    if (!idPedido || !idProduto || !quantidade) {
        return res.status(400).json({message: "ID do pedido, ID do produto e quantidade são obrigatórios"})
    }

    if (quantidade <= 0) {
        return res.status(400).json({message: "Quantidade deve ser maior que zero"})
    }

    try {
        // Verificar se pedido existe e está em status permitido
        const pedido = await Pedido.findByPk(idPedido)
        if (!pedido) {
            return res.status(404).json({message: 'Pedido não encontrado'})
        }

        if (pedido.status !== 'PENDENTE_PAGAMENTO') {
            return res.status(400).json({message: 'Não é possível adicionar itens a um pedido já processado'})
        }

        // Verificar se produto existe e está ativo
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        if (!produto.ativo) {
            return res.status(400).json({message: 'Produto não está disponível'})
        }

        // Verificar estoque
        const estoque = await Estoque.findOne({ where: { idProduto } })
        if (estoque && estoque.quantidade_atual < quantidade) {
            return res.status(400).json({message: 'Quantidade em estoque insuficiente'})
        }

        // Verificar se item já existe no pedido
        const itemExistente = await ItemPedido.findOne({
            where: { idPedido, idProduto }
        })

        if (itemExistente) {
            return res.status(400).json({message: 'Produto já existe no pedido. Use atualizar quantidade.'})
        }

        const precoUnitario = produto.preco
        const valorTotalItem = precoUnitario * quantidade

        const item = await ItemPedido.create({
            idPedido,
            idProduto,
            quantidade,
            precoUnitario,
            valorTotalItem
        })

        // Recalcular totais do pedido
        await recalcularTotaisPedido(idPedido)

        const itemCompleto = await ItemPedido.findByPk(item.codItemPedido, {
            include: [
                { model: Pedido, as: 'pedidoItem' },
                { model: Produto, as: 'produtoItem' }
            ]
        })

        res.status(201).json(itemCompleto)
    } catch (err) {
        console.error('Erro ao adicionar item ao pedido', err)
        res.status(500).json({error: 'Erro ao adicionar item ao pedido', err})
    }
}

const atualizarQuantidade = async (req, res) => {
    const id = req.params.id
    const { quantidade } = req.body
    
    if (!quantidade || quantidade <= 0) {
        return res.status(400).json({message: "Quantidade deve ser maior que zero"})
    }

    try {
        const item = await ItemPedido.findByPk(id, {
            include: [
                { model: Pedido, as: 'pedidoItem' },
                { model: Produto, as: 'produtoItem' }
            ]
        })

        if (!item) {
            return res.status(404).json({message: 'Item não encontrado'})
        }

        // Verificar se pedido permite alteração
        if (item.pedidoItem.status !== 'PENDENTE_PAGAMENTO') {
            return res.status(400).json({message: 'Não é possível alterar itens de um pedido já processado'})
        }

        // Verificar estoque
        const estoque = await Estoque.findOne({ where: { idProduto: item.idProduto } })
        if (estoque && estoque.quantidade_atual < quantidade) {
            return res.status(400).json({message: 'Quantidade em estoque insuficiente'})
        }

        const valorTotalItem = item.precoUnitario * quantidade

        await ItemPedido.update(
            { quantidade, valorTotalItem },
            { where: { codItemPedido: id } }
        )

        // Recalcular totais do pedido
        await recalcularTotaisPedido(item.idPedido)

        const itemAtualizado = await ItemPedido.findByPk(id, {
            include: [
                { model: Pedido, as: 'pedidoItem' },
                { model: Produto, as: 'produtoItem' }
            ]
        })

        res.status(200).json(itemAtualizado)
    } catch (err) {
        console.error('Erro ao atualizar quantidade do item', err)
        res.status(500).json({error: 'Erro ao atualizar quantidade do item', err})
    }
}

const removerItem = async (req, res) => {
    const id = req.params.id

    try {
        const item = await ItemPedido.findByPk(id, {
            include: [{ model: Pedido, as: 'pedidoItem' }]
        })

        if (!item) {
            return res.status(404).json({message: 'Item não encontrado'})
        }

        // Verificar se pedido permite alteração
        if (item.pedidoItem.status !== 'PENDENTE_PAGAMENTO') {
            return res.status(400).json({message: 'Não é possível remover itens de um pedido já processado'})
        }

        const idPedido = item.idPedido

        await ItemPedido.destroy({ where: { codItemPedido: id } })

        // Recalcular totais do pedido
        await recalcularTotaisPedido(idPedido)

        res.status(200).json({message: 'Item removido do pedido com sucesso'})
    } catch (err) {
        console.error('Erro ao remover item do pedido', err)
        res.status(500).json({error: 'Erro ao remover item do pedido', err})
    }
}

const listarItensPorPedido = async (req, res) => {
    const idPedido = req.params.idPedido

    try {
        const itens = await ItemPedido.findAll({
            where: { idPedido },
            include: [
                { model: Pedido, as: 'pedidoItem' },
                { model: Produto, as: 'produtoItem' }
            ],
            order: [['codItemPedido', 'ASC']]
        })
        
        res.status(200).json(itens)
    } catch (err) {
        console.error('Erro ao listar itens do pedido', err)
        res.status(500).json({error: 'Erro ao listar itens do pedido', err})
    }
}

// Função auxiliar para recalcular totais do pedido
async function recalcularTotaisPedido(idPedido) {
    const itens = await ItemPedido.findAll({ where: { idPedido } })
    
    let valorSubtotal = 0
    for (const item of itens) {
        valorSubtotal += parseFloat(item.valorTotalItem)
    }

    // Calcular frete (exemplo: frete grátis acima de R$ 100)
    const valorFrete = valorSubtotal > 100 ? 0 : 15.00
    const valorTotal = valorSubtotal + valorFrete

    await Pedido.update(
        { valorSubtotal, valorFrete, valorTotal },
        { where: { codPedido: idPedido } }
    )
}

module.exports = {
    adicionarItem,
    atualizarQuantidade,
    removerItem,
    listarItensPorPedido
}