const Produto = require('../models/Produto')
const Fornecedor = require('../models/Fornecedor')

const vincularProdutoFornecedor = async (req, res) => {
    const { idProduto, idFornecedor, custoUnitarioAtual, codigoReferencia } = req.body
    
    if (!idProduto || !idFornecedor) {
        return res.status(400).json({message: "ID do produto e do fornecedor são obrigatórios"})
    }

    try {
        // Verificar se produto e fornecedor existem
        const produto = await Produto.findByPk(idProduto)
        const fornecedor = await Fornecedor.findByPk(idFornecedor)

        if (!produto) {
            return res.status(404).json({message: 'Produto não encontrado'})
        }
        if (!fornecedor) {
            return res.status(404).json({message: 'Fornecedor não encontrado'})
        }

        // Verificar se já existe o vínculo
        const vinculoExistente = await ProdutoFornecedor.findOne({
            where: { idProduto, idFornecedor }
        })

        if (vinculoExistente) {
            return res.status(400).json({message: 'Este produto já está vinculado a este fornecedor'})
        }

        const vinculo = await ProdutoFornecedor.create({
            idProduto,
            idFornecedor,
            custoUnitarioAtual,
            codigoReferencia
        })

        res.status(201).json(vinculo)
    } catch (err) {
        console.error('Erro ao vincular produto com fornecedor', err)
        res.status(500).json({error: 'Erro ao vincular produto com fornecedor', err})
    }
}

const listarFornecedoresDoProduto = async (req, res) => {
    const idProduto = req.params.idProduto

    try {
        const fornecedores = await ProdutoFornecedor.findAll({
            where: { idProduto },
            include: [
                { model: Produto, as: 'produtoNoFornecedor' },
                { model: Fornecedor, as: 'fornecedorDoProduto' }
            ]
        })
        
        res.status(200).json(fornecedores)
    } catch (err) {
        console.error('Erro ao listar fornecedores do produto', err)
        res.status(500).json({error: 'Erro ao listar fornecedores do produto', err})
    }
}

const listarProdutosDoFornecedor = async (req, res) => {
    const idFornecedor = req.params.idFornecedor

    try {
        const produtos = await ProdutoFornecedor.findAll({
            where: { idFornecedor },
            include: [
                { model: Produto, as: 'produtoNoFornecedor' },
                { model: Fornecedor, as: 'fornecedorDoProduto' }
            ]
        })
        
        res.status(200).json(produtos)
    } catch (err) {
        console.error('Erro ao listar produtos do fornecedor', err)
        res.status(500).json({error: 'Erro ao listar produtos do fornecedor', err})
    }
}

const atualizarCusto = async (req, res) => {
    const id = req.params.id
    const { custoUnitarioAtual } = req.body

    if (!custoUnitarioAtual || custoUnitarioAtual <= 0) {
        return res.status(400).json({message: "Custo unitário deve ser maior que zero"})
    }

    try {
        const vinculo = await ProdutoFornecedor.findByPk(id)
        if (vinculo) {
            await ProdutoFornecedor.update(
                { custoUnitarioAtual }, 
                { where: { codProdutoFornecedor: id } }
            )
            res.status(200).json({message: 'Custo atualizado com sucesso'})
        } else {
            res.status(404).json({message: 'Vínculo não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar custo', err)
        res.status(500).json({error: 'Erro ao atualizar custo', err})
    }
}

const removerVinculo = async (req, res) => {
    const id = req.params.id

    try {
        const vinculo = await ProdutoFornecedor.findByPk(id)
        if (vinculo) {
            await ProdutoFornecedor.destroy({ where: { codProdutoFornecedor: id } })
            res.status(200).json({message: 'Vínculo removido com sucesso'})
        } else {
            res.status(404).json({message: 'Vínculo não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao remover vínculo', err)
        res.status(500).json({error: 'Erro ao remover vínculo', err})
    }
}

module.exports = {
    vincularProdutoFornecedor,
    listarFornecedoresDoProduto,
    listarProdutosDoFornecedor,
    atualizarCusto,
    removerVinculo
}