const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {
    try {
        const { idProduto, quantidade_atual, quantidade_minima } = req.body

        if (!idProduto) {
            return res.status(400).json({ message: "ID do produto é obrigatório" })
        }

        // Verificar se produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }

        // Verificar se já existe estoque para este produto
        const estoqueExistente = await Estoque.findOne({ where: { idProduto } })
        if (estoqueExistente) {
            return res.status(400).json({ message: 'Já existe registro de estoque para este produto' })
        }

        const estoque = await Estoque.create({
            idProduto,
            quantidade_atual: quantidade_atual || 0,
            quantidade_minima: quantidade_minima || 0
        })

        res.status(201).json(estoque)
    } catch (err) {
        console.error('Erro ao cadastrar estoque', err)
        res.status(500).json({ error: 'Erro ao cadastrar estoque' })
    }
}

const listar = async (req, res) => {
    try {
        const estoques = await Estoque.findAll({
            include: [{ model: Produto, as: 'produtoEstoque' }],
            order: [['idProduto', 'ASC']]
        })
        res.status(200).json(estoques)
    } catch (err) {
        console.error('Erro ao listar estoques', err)
        res.status(500).json({ error: 'Erro ao listar estoques' })
    }
}

const buscarPorProduto = async (req, res) => {
    const idProduto = req.params.idProduto

    try {
        const estoque = await Estoque.findOne({
            where: { idProduto },
            include: [{ model: Produto, as: 'produtoEstoque' }]
        })
        
        if (estoque) {
            res.status(200).json(estoque)
        } else {
            res.status(404).json({ message: 'Estoque não encontrado para este produto' })
        }
    } catch (err) {
        console.error('Erro ao buscar estoque', err)
        res.status(500).json({ error: 'Erro ao buscar estoque' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const { quantidade_atual, quantidade_minima } = req.body

    try {
        const estoque = await Estoque.findByPk(id)
        if (estoque) {
            await Estoque.update(
                { quantidade_atual, quantidade_minima },
                { where: { codEstoque: id } }
            )
            res.status(200).json({ message: 'Estoque atualizado com sucesso' })
        } else {
            res.status(404).json({ message: 'Estoque não encontrado' })
        }
    } catch (err) {
        console.error('Erro ao atualizar estoque', err)
        res.status(500).json({ error: 'Erro ao atualizar estoque' })
    }
}

module.exports = {
    cadastrar,
    listar,
    buscarPorProduto,
    atualizar
}