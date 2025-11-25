const Compra = require('../models/Compra')
const ItensCompra = require('../models/ItensCompra')
const Produto = require('../models/Produto')
const Fornecedor = require('../models/Fornecedor')
const Estoque = require('../models/Estoque')

const criarCompra = async (req, res) => {
    const { referenciaFornecedor, numeroDocumento, itens, idFornecedor } = req.body
    
    if (!referenciaFornecedor || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({message: "Dados da compra incompletos"})
    }

    try {
        // Calcular valor total
        let valorTotal = 0
        const itensComCusto = []
        
        for (const item of itens) {
            if (!item.custoUnitario || item.custoUnitario <= 0) {
                return res.status(400).json({message: "Custo unitário deve ser maior que zero"})
            }
            
            const custoTotalItem = item.custoUnitario * item.quantidade
            itensComCusto.push({
                ...item,
                custoTotalItem
            })
            
            valorTotal += custoTotalItem
        }

        // Criar compra
        const compra = await Compra.create({
            referenciaFornecedor,
            numeroDocumento,
            valorTotal,
            idFornecedor,
            statusCompra: 'AGUARDANDO_NOTA'
        })

        // Criar itens da compra
        for (const item of itensComCusto) {
            await ItensCompra.create({
                idCompra: compra.codCompra,
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                custoUnitario: item.custoUnitario
            })
        }

        // Buscar compra completa para retornar
        const compraCompleta = await Compra.findByPk(compra.codCompra, {
            include: [{
                model: ItensCompra,
                as: 'itensDaCompra',
                include: [{ model: Produto, as: 'produtoItemCompra' }]
            }]
        })

        res.status(201).json(compraCompleta)
    } catch (err) {
        console.error('Erro ao criar compra', err)
        res.status(500).json({error: 'Erro ao criar compra', err})
    }
}

const listarCompras = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            include: [{
                model: ItensCompra,
                as: 'itensDaCompra',
                include: [{ model: Produto, as: 'produtoItemCompra' }]
            }],
            order: [['dataCompra', 'DESC']]
        })
        
        res.status(200).json(compras)
    } catch (err) {
        console.error('Erro ao listar compras', err)
        res.status(500).json({error: 'Erro ao listar compras', err})
    }
}

const receberCompra = async (req, res) => {
    const id = req.params.id
    const { statusCompra } = req.body

    const statusValidos = ['RECEBIDA_PARCIAL', 'RECEBIDA_TOTAL', 'CANCELADA']
    if (!statusValidos.includes(statusCompra)) {
        return res.status(400).json({message: "Status inválido"})
    }

    try {
        const compra = await Compra.findByPk(id, {
            include: [{
                model: ItensCompra,
                as: 'itensDaCompra'
            }]
        })

        if (!compra) {
            return res.status(404).json({message: 'Compra não encontrada'})
        }

        // Atualizar status da compra
        await Compra.update({ statusCompra }, { where: { codCompra: id } })

        // Se a compra foi totalmente recebida, atualizar estoque
        if (statusCompra === 'RECEBIDA_TOTAL') {
            for (const item of compra.itensDaCompra) {
                await atualizarEstoque(item.idProduto, item.quantidade)
            }
        }

        res.status(200).json({message: 'Compra atualizada com sucesso'})
    } catch (err) {
        console.error('Erro ao receber compra', err)
        res.status(500).json({error: 'Erro ao receber compra', err})
    }
}

// Função auxiliar para atualizar estoque
async function atualizarEstoque(idProduto, quantidade) {
    let estoque = await Estoque.findOne({ where: { idProduto } })
    
    if (estoque) {
        await Estoque.update(
            { quantidade_atual: estoque.quantidade_atual + quantidade },
            { where: { idProduto } }
        )
    } else {
        await Estoque.create({
            idProduto,
            quantidade_atual: quantidade,
            quantidade_minima: 0
        })
    }
}

const buscarCompraPorId = async (req, res) => {
    const id = req.params.id

    try {
        const compra = await Compra.findByPk(id, {
            include: [{
                model: ItensCompra,
                as: 'itensDaCompra',
                include: [{ model: Produto, as: 'produtoItemCompra' }]
            }]
        })
        
        if (compra) {
            res.status(200).json(compra)
        } else {
            res.status(404).json({message: 'Compra não encontrada'})
        }
    } catch (err) {
        console.error('Erro ao buscar compra', err)
        res.status(500).json({error: 'Erro ao buscar compra', err})
    }
}

module.exports = {
    criarCompra,
    listarCompras,
    receberCompra,
    buscarCompraPorId
}