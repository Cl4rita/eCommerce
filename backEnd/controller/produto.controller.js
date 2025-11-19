const Produto = require('../models/Produto')
const CategoriaProduto = require('../models/CategoriaProduto')
const Estoque = require('../models/Estoque')

const cadastrar = async (req,res) => {
    const valores = req.body

    if(Array.isArray(valores)){
        try{
            const dados = await Produto.bulkCreate(valores)
            res.status(201).json({message: 'Pedido finalizado com sucesso', dados})
        }catch(err){
            res.status(500).json({error: 'Erro ao finalizar pedido'})
            console.error('Erro ao finalizar pedido', err)
        }
    }
    else {
        if(!valores.nome || !valores.marca || !valores.descricao || !valores.preco || !valores.imagem){
            return res.status(400).json({message: 'Campos obrigatórios'})
        }

        if (valores.preco <= 0) {
            return res.status(400).json({message: "O preço deve ser maior que zero"})
        }

        try{
            const dados = await Produto.create(valores)
            res.status(201).json({message: 'Produto cadastrado', dados})
        }catch(err){
            res.status(500).json({error: 'Erro ao cadastrar'})
            console.error('Erro ao cadastrar', err)
        }
    }
}

const listar = async (req, res) => {
    try {
        const dados = await Produto.findAll({
            include: [{
                model: CategoriaProduto,
                as: 'categoriaProduto'
            }, {
                model: Estoque,
                as: 'estoqueProduto'
            }]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar produtos', err)
        res.status(500).json({error: 'Erro ao listar produtos', err})
    }
}

const listarAtivos = async (req, res) => {
    try {
        const dados = await Produto.findAll({
            where: { ativo: true },
            include: [{
                model: CategoriaProduto,
                as: 'categoriaProduto',
                where: { is_ativo: true }
            }, {
                model: Estoque,
                as: 'estoqueProduto'
            }]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar produtos ativos', err)
        res.status(500).json({error: 'Erro ao listar produtos ativos', err})
    }
}

const buscarPorId = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({message: "Código do produto é obrigatório"})
    }

    try {
        const dados = await Produto.findByPk(id, {
            include: [{
                model: CategoriaProduto,
                as: 'categoriaProduto'
            }, {
                model: Estoque,
                as: 'estoqueProduto'
            }]
        })
        
        if (dados) {
            res.status(200).json(dados)
        } else {
            res.status(404).json({message: 'Produto não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao buscar produto', err)
        res.status(500).json({error: 'Erro ao buscar produto', err})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body
    
    if (!id || !valores.nome) {
        return res.status(400).json({message: "Código e nome são obrigatórios"})
    }

    try {
        let dados = await Produto.findByPk(id)
        if (dados) {
            await Produto.update(valores, { where: { codProduto: id } })
            dados = await Produto.findByPk(id)
            res.status(200).json(dados)
        } else {
            res.status(404).json({message: 'Produto não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar produto', err)
        res.status(500).json({error: 'Erro ao atualizar produto', err})
    }
}

const desativar = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({message: "Código do produto é obrigatório"})
    }

    try {
        const dados = await Produto.findByPk(id)
        if (dados) {
            await Produto.update({ ativo: false }, { where: { codProduto: id } })
            res.status(200).json({message: 'Produto desativado com sucesso'})
        } else {
            res.status(404).json({message: 'Produto não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao desativar produto', err)
        res.status(500).json({error: 'Erro ao desativar produto', err})
    }
}

module.exports = { cadastrar, listar, listarAtivos, buscarPorId, atualizar, desativar }