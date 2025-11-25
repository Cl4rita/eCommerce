const { criarProduto, listarProdutos, 
    atualizarProduto, atualizarProdutoCompleto,
    apagarProduto } = require('../services/produto.service')

async function criar(req, res) {

    try {

        const produto = await criarProduto(req.body)

        return res.status(201).json({
            mensagem: 'Produto criado com sucesso',
            produto
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const produtos = await listarProdutos()

        return res.status(200).json(produtos)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente produto (PATCH /produto/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoAtualizado = await atualizarProduto(id, dados)

        return res.status(200).json({
            mensagem: 'Produto atualizado com sucesso',
            produto: produtoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }

}

// PUT - Atualização total
async function atualizarCompleto(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoAtualizado = await atualizarProdutoCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Produto atualizado completamente com sucesso',
            produto: produtoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarProduto(id)

        return res.status(200).json({ mensagem: 'Produto apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }


/*const Pedido = require('../models/Pedido')
const ItemPedido = require('../models/ItemPedido')
const Produto = require('../models/Produto')
const Usuario = require('../models/Usuario')
const Endereco = require('../models/Endereco')

const criarPedido = async (req, res) => {
    const { idUsuario, idEndereco, itens, metodoPagamento } = req.body
    
    if (!idUsuario || !idEndereco || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({message: "Dados do pedido incompletos"})
    }

    try {
        // Calcular totais
        let valorSubtotal = 0
        const itensComPreco = []
        
        for (const item of itens) {
            const produto = await Produto.findByPk(item.idProduto)
            if (!produto) {
                return res.status(404).json({message: `Produto ${item.idProduto} não encontrado`})
            }
            
            if (!produto.ativo) {
                return res.status(400).json({message: `Produto ${produto.nome} não está disponível`})
            }
            
            const precoUnitario = produto.preco
            const valorTotalItem = precoUnitario * item.quantidade
            
            itensComPreco.push({
                ...item,
                precoUnitario,
                valorTotalItem
            })
            
            valorSubtotal += valorTotalItem
        }

        // Calcular frete (exemplo fixo)
        const valorFrete = valorSubtotal > 100 ? 0 : 15.00
        const valorTotal = valorSubtotal + valorFrete

        // Criar pedido
        const pedido = await Pedido.create({
            idUsuario,
            idEndereco,
            valorSubtotal,
            valorFrete,
            valorTotal,
            metodoPagamento,
            status: 'PENDENTE_PAGAMENTO'
        })

        // Criar itens do pedido
        for (const item of itensComPreco) {
            await ItemPedido.create({
                idPedido: pedido.codPedido,
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                valorTotalItem: item.valorTotalItem
            })
        }

        // Buscar pedido completo para retornar
        const pedidoCompleto = await Pedido.findByPk(pedido.codPedido, {
            include: [
                { model: Usuario, as: 'usuarioPedido' },
                { model: Endereco, as: 'enderecoEntrega' },
                { 
                    model: ItemPedido, 
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ]
        })

        res.status(201).json(pedidoCompleto)
    } catch (err) {
        console.error('Erro ao criar pedido', err)
        res.status(500).json({error: 'Erro ao criar pedido', err})
    }
}

const listarPedidosUsuario = async (req, res) => {
    const idUsuario = req.user.codUsuario // Do middleware de auth

    try {
        const pedidos = await Pedido.findAll({
            where: { idUsuario },
            include: [
                { model: Endereco, as: 'enderecoEntrega' },
                { 
                    model: ItemPedido, 
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ],
            order: [['dataPedido', 'DESC']]
        })
        
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos', err)
        res.status(500).json({error: 'Erro ao listar pedidos', err})
    }
}

const buscarPedidoPorId = async (req, res) => {
    const id = req.params.id
    const idUsuario = req.user.codUsuario

    try {
        const pedido = await Pedido.findOne({
            where: { codPedido: id, idUsuario },
            include: [
                { model: Usuario, as: 'usuarioPedido' },
                { model: Endereco, as: 'enderecoEntrega' },
                { 
                    model: ItemPedido, 
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ]
        })
        
        if (pedido) {
            res.status(200).json(pedido)
        } else {
            res.status(404).json({message: 'Pedido não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao buscar pedido', err)
        res.status(500).json({error: 'Erro ao buscar pedido', err})
    }
}

const atualizarStatus = async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    const statusValidos = [
        'PENDENTE_PAGAMENTO', 'PROCESSANDO_PAGAMENTO', 'PAGO', 
        'SEPARACAO_ESTOQUE', 'ENVIADO', 'ENTREGUE', 'CANCELADO'
    ]

    if (!statusValidos.includes(status)) {
        return res.status(400).json({message: "Status inválido"})
    }

    try {
        const pedido = await Pedido.findByPk(id)
        if (pedido) {
            await Pedido.update({ status }, { where: { codPedido: id } })
            res.status(200).json({message: 'Status atualizado com sucesso'})
        } else {
            res.status(404).json({message: 'Pedido não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar status', err)
        res.status(500).json({error: 'Erro ao atualizar status', err})
    }
}

module.exports = {
    criarPedido,
    listarPedidosUsuario,
    buscarPedidoPorId,
    atualizarStatus
} */