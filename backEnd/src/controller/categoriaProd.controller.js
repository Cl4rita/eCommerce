const CategoriaProduto = require('../models/CategoriaProduto')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {
    const valores = req.body
    
    if (!valores.nome) {
        return res.status(400).json({ message: "O campo nome é obrigatório" })
    }

    // Validação do nome - apenas letras, espaços e alguns caracteres especiais
    const nomeRegex = /^[A-Za-zÀ-ÿ0-9\s&.,-]{2,80}$/
    if (!nomeRegex.test(valores.nome)) {
        return res.status(400).json({ message: "Nome inválido! Use apenas letras, números e espaços (2-80 caracteres)." })
    }

    try {
        const dados = await CategoriaProduto.create(valores)
        res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao cadastrar categoria', err)
        
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Já existe uma categoria com este nome' })
        }
        
        res.status(500).json({ error: 'Erro ao cadastrar categoria' })
    }
}

const listar = async (req, res) => {
    try {
        const dados = await CategoriaProduto.findAll({
            order: [['nome', 'ASC']]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar categorias', err)
        res.status(500).json({ error: 'Erro ao listar categorias' })
    }
}

const listarAtivas = async (req, res) => {
    try {
        const dados = await CategoriaProduto.findAll({
            where: { is_ativo: true },
            order: [['nome', 'ASC']]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar categorias ativas', err)
        res.status(500).json({ error: 'Erro ao listar categorias ativas' })
    }
}

const buscarPorId = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({ message: "Código da categoria é obrigatório" })
    }

    try {
        const dados = await CategoriaProduto.findByPk(id, {
            include: [{
                model: Produto,
                as: 'produtosDaCategoria',
                where: { ativo: true },
                required: false
            }]
        })
        
        if (dados) {
            res.status(200).json(dados)
        } else {
            res.status(404).json({ message: 'Categoria não encontrada' })
        }
    } catch (err) {
        console.error('Erro ao buscar categoria', err)
        res.status(500).json({ error: 'Erro ao buscar categoria' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body
    
    if (!id || !valores.nome) {
        return res.status(400).json({ message: "Código e nome são obrigatórios" })
    }

    // Validação do nome
    const nomeRegex = /^[A-Za-zÀ-ÿ0-9\s&.,-]{2,80}$/
    if (!nomeRegex.test(valores.nome)) {
        return res.status(400).json({ message: "Nome inválido! Use apenas letras, números e espaços (2-80 caracteres)." })
    }

    try {
        let dados = await CategoriaProduto.findByPk(id)
        if (dados) {
            await CategoriaProduto.update(valores, { where: { codCategoria: id } })
            dados = await CategoriaProduto.findByPk(id)
            res.status(200).json(dados)
        } else {
            res.status(404).json({ message: 'Categoria não encontrada' })
        }
    } catch (err) {
        console.error('Erro ao atualizar categoria', err)
        
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Já existe uma categoria com este nome' })
        }
        
        res.status(500).json({ error: 'Erro ao atualizar categoria' })
    }
}

const desativar = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({ message: "Código da categoria é obrigatório" })
    }

    try {
        const dados = await CategoriaProduto.findByPk(id)
        if (dados) {
            // Verificar se existem produtos ativos nesta categoria
            const produtosAtivos = await Produto.count({
                where: { 
                    idCategoria: id,
                    ativo: true 
                }
            })

            if (produtosAtivos > 0) {
                return res.status(400).json({ 
                    message: 'Não é possível desativar categoria com produtos ativos' 
                })
            }

            await CategoriaProduto.update(
                { is_ativo: false }, 
                { where: { codCategoria: id } }
            )
            res.status(200).json({ message: 'Categoria desativada com sucesso' })
        } else {
            res.status(404).json({ message: 'Categoria não encontrada' })
        }
    } catch (err) {
        console.error('Erro ao desativar categoria', err)
        res.status(500).json({ error: 'Erro ao desativar categoria' })
    }
}

const ativar = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({ message: "Código da categoria é obrigatório" })
    }

    try {
        const dados = await CategoriaProduto.findByPk(id)
        if (dados) {
            await CategoriaProduto.update(
                { is_ativo: true }, 
                { where: { codCategoria: id } }
            )
            res.status(200).json({ message: 'Categoria ativada com sucesso' })
        } else {
            res.status(404).json({ message: 'Categoria não encontrada' })
        }
    } catch (err) {
        console.error('Erro ao ativar categoria', err)
        res.status(500).json({ error: 'Erro ao ativar categoria' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({ message: "Código da categoria é obrigatório" })
    }

    try {
        const dados = await CategoriaProduto.findByPk(id)
        if (dados) {
            // Verificar se existem produtos vinculados a esta categoria
            const produtosVinculados = await Produto.count({
                where: { idCategoria: id }
            })

            if (produtosVinculados > 0) {
                return res.status(400).json({ 
                    message: 'Não é possível apagar categoria com produtos vinculados' 
                })
            }

            await CategoriaProduto.destroy({ where: { codCategoria: id } })
            res.status(200).json({ message: 'Categoria apagada com sucesso' })
        } else {
            res.status(404).json({ message: 'Categoria não encontrada' })
        }
    } catch (err) {
        console.error('Erro ao apagar categoria', err)
        res.status(500).json({ error: 'Erro ao apagar categoria' })
    }
}

module.exports = {
    cadastrar,
    listar,
    listarAtivas,
    buscarPorId,
    atualizar,
    desativar,
    ativar,
    apagar
}