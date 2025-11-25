const Produto = require('../models/Produto')
const CategoriaProduto = require('../models/CategoriaProduto')

async function criarProduto(dados) {
    const { nome, descricao, modelo, preco, imagem_url, ativo, idCategoria } = dados

    // Validações antes de salvar
    if (!nome || !modelo || !preco || !idCategoria) {
        throw new Error('Nome, modelo, preço e categoria são obrigatórios')
    }

    if (preco <= 0) {
        throw new Error('Preço deve ser maior que zero')
    }

    // Verificar se categoria existe
    const categoria = await CategoriaProduto.findByPk(idCategoria)
    if (!categoria) {
        throw new Error('Categoria não encontrada')
    }

    const novoProduto = await Produto.create({
        nome,
        descricao,
        modelo,
        preco,
        imagem_url,
        ativo: ativo !== undefined ? ativo : true,
        idCategoria
    })

    return novoProduto
}

async function listarProdutos(filtros = {}) {
    const where = {}
    
    // Filtro por categoria
    if (filtros.idCategoria) {
        where.idCategoria = filtros.idCategoria
    }
    
    // Filtro por status ativo
    if (filtros.ativo !== undefined) {
        where.ativo = filtros.ativo
    }

    const produtos = await Produto.findAll({
        where,
        include: [{
            model: CategoriaProduto,
            as: 'categoriaProduto'
        }],
        order: [['nome', 'ASC']]
    })
    return produtos
}

async function buscarProdutoPorId(id) {
    const produto = await Produto.findByPk(id, {
        include: [{
            model: CategoriaProduto,
            as: 'categoriaProduto'
        }]
    })
    
    if (!produto) {
        throw new Error('Produto não encontrado')
    }
    
    return produto
}

async function atualizarProduto(id, dados) {
    const produto = await Produto.findByPk(id)
    
    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    // Verificar categoria se for fornecida
    if (dados.idCategoria) {
        const categoria = await CategoriaProduto.findByPk(dados.idCategoria)
        if (!categoria) {
            throw new Error('Categoria não encontrada')
        }
    }

    // Validar preço se for fornecido
    if (dados.preco !== undefined && dados.preco <= 0) {
        throw new Error('Preço deve ser maior que zero')
    }

    await produto.update(dados)
    return produto
}

async function atualizarProdutoCompleto(id, dados) {
    const { nome, descricao, modelo, preco, imagem_url, ativo, idCategoria } = dados

    // Validações completas
    if (!nome || !modelo || !preco || !idCategoria) {
        throw new Error('Nome, modelo, preço e categoria são obrigatórios')
    }

    if (preco <= 0) {
        throw new Error('Preço deve ser maior que zero')
    }

    const produto = await Produto.findByPk(id)
    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    // Verificar categoria
    const categoria = await CategoriaProduto.findByPk(idCategoria)
    if (!categoria) {
        throw new Error('Categoria não encontrada')
    }

    await produto.update({
        nome,
        descricao,
        modelo,
        preco,
        imagem_url,
        ativo: ativo !== undefined ? ativo : true,
        idCategoria
    })

    return produto
}

async function apagarProduto(id) {
    const produto = await Produto.findByPk(id)
    
    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    await produto.destroy()
    return true
}

module.exports = { 
    criarProduto, 
    listarProdutos, 
    buscarProdutoPorId,
    atualizarProduto, 
    atualizarProdutoCompleto, 
    apagarProduto 
}