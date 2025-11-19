const Pedido = require('../model/Pedido')
const ItemPedido = require('../model/ItemPedido')
const Produto = require('../model/Produto')

const finalizarPedido = async (req, res) => {
    try {
        const { produtos, idUsuario, formaPagamento } = req.body

        if (!produtos || produtos.length === 0) {
            return res.status(400).json({ message: 'Carrinho vazio' })
        }

        const total = produtos.reduce((acc, produto) => {
            return acc + (produto.preco * produto.qtde)
        }, 0)

        const pedido = await Pedido.create({
            idUsuario: idUsuario,
            total: total,
            formaPagamento: formaPagamento || 'cartão'
        })

        // Cria os itens do pedido
        for (let produto of produtos) {
            await ItemPedido.create({
                idPedido: pedido.id,
                idProduto: produto.id,
                quantidade: produto.qtde,
                precoUnitario: produto.preco,
                subtotal: produto.preco * produto.qtde
            })
        }

        res.status(201).json({ 
            message: 'Pedido finalizado com sucesso!', 
            pedidoId: pedido.id 
        })

    } catch (err) {
        console.error('Erro ao finalizar pedido:', err)
        res.status(500).json({ error: 'Erro ao finalizar pedido' })
    }
}

const listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{
                model: ItemPedido,
                as: 'itensPedido',
                include: [{
                    model: Produto,
                    as: 'Produto'
                }]
            }]
        })
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos:', err)
        res.status(500).json({ error: 'Erro ao listar pedidos' })
    }
}

module.exports = { finalizarPedido, listarPedidos }