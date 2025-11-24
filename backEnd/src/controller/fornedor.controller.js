const Fornecedor = require('../models/Fornecedor')

const cadastrar = async (req, res) => {
    const valores = req.body
    
    if (!valores.nomeEmpresa || !valores.cnpj) {
        return res.status(400).json({message: "Os campos nome da empresa e CNPJ são obrigatórios"})
    }

    // Validação básica de CNPJ
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    if (!cnpjRegex.test(valores.cnpj)) {
        return res.status(400).json({message: "CNPJ inválido! Formato: XX.XXX.XXX/XXXX-XX"})
    }

    try {
        const dados = await Fornecedor.create(valores)
        res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao cadastrar fornecedor', err)
        res.status(500).json({error: 'Erro ao cadastrar fornecedor', err})
    }
}

const listar = async (req, res) => {
    try {
        const dados = await Fornecedor.findAll()
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar fornecedores', err)
        res.status(500).json({error: 'Erro ao listar fornecedores', err})
    }
}

const buscarPorId = async (req, res) => {
    const id = req.params.id
    
    if (!id) {
        return res.status(400).json({message: "Código do fornecedor é obrigatório"})
    }

    try {
        const dados = await Fornecedor.findByPk(id)
        if (dados) {
            res.status(200).json(dados)
        } else {
            res.status(404).json({message: 'Fornecedor não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao buscar fornecedor', err)
        res.status(500).json({error: 'Erro ao buscar fornecedor', err})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body
    
    if (!id || !valores.nomeEmpresa) {
        return res.status(400).json({message: "Código e nome da empresa são obrigatórios"})
    }

    try {
        let dados = await Fornecedor.findByPk(id)
        if (dados) {
            await Fornecedor.update(valores, { where: { codFornecedor: id } })
            dados = await Fornecedor.findByPk(id)
            res.status(200).json(dados)
        } else {
            res.status(404).json({message: 'Fornecedor não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar fornecedor', err)
        res.status(500).json({error: 'Erro ao atualizar fornecedor', err})
    }
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar
}