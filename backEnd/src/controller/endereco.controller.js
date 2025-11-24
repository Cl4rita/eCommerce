// endereco.controller.js
const Endereco = require('../models/Endereco')
const Usuario = require('../models/Usuario')

const cadastrar = async (req, res) => {
    const valores = req.body
    const idUsuario = req.user.codUsuario // Do middleware de auth

    // Campos obrigatórios do ViaCEP + número
    const camposObrigatorios = ['cep', 'logradouro', 'bairro', 'localidade', 'uf', 'numero']
    for (const campo of camposObrigatorios) {
        if (!valores[campo]) {
            return res.status(400).json({message: `Campo ${campo} é obrigatório`})
        }
    }

    // Validação de CEP
    const cepRegex = /^\d{5}-\d{3}$/
    if (!cepRegex.test(valores.cep)) {
        return res.status(400).json({message: "CEP inválido! Formato: 00000-000"})
    }

    try {
        // Se este for o primeiro endereço ou marcado como principal, definir como principal
        if (valores.is_principal) {
            await Endereco.update(
                { is_principal: false }, 
                { where: { idUsuario } }
            )
        }

        const dados = await Endereco.create({
            ...valores,
            idUsuario
        })

        res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao cadastrar endereço', err)
        res.status(500).json({error: 'Erro ao cadastrar endereço', err})
    }
}

const listarPorUsuario = async (req, res) => {
    const idUsuario = req.user.codUsuario

    try {
        const dados = await Endereco.findAll({
            where: { idUsuario },
            order: [['is_principal', 'DESC'], ['apelido', 'ASC']]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar endereços', err)
        res.status(500).json({error: 'Erro ao listar endereços', err})
    }
}

const definirPrincipal = async (req, res) => {
    const id = req.params.id
    const idUsuario = req.user.codUsuario

    try {
        // Verificar se o endereço pertence ao usuário
        const endereco = await Endereco.findOne({
            where: { codEndereco: id, idUsuario }
        })

        if (!endereco) {
            return res.status(404).json({message: 'Endereço não encontrado'})
        }

        // Remover principal de todos os endereços do usuário
        await Endereco.update(
            { is_principal: false }, 
            { where: { idUsuario } }
        )

        // Definir este como principal
        await Endereco.update(
            { is_principal: true }, 
            { where: { codEndereco: id } }
        )

        res.status(200).json({message: 'Endereço principal definido com sucesso'})
    } catch (err) {
        console.error('Erro ao definir endereço principal', err)
        res.status(500).json({error: 'Erro ao definir endereço principal', err})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const idUsuario = req.user.codUsuario
    const valores = req.body

    try {
        // Verificar se o endereço pertence ao usuário
        const endereco = await Endereco.findOne({
            where: { codEndereco: id, idUsuario }
        })

        if (!endereco) {
            return res.status(404).json({message: 'Endereço não encontrado'})
        }

        // Se estiver definindo como principal, remover principal dos outros
        if (valores.is_principal) {
            await Endereco.update(
                { is_principal: false }, 
                { where: { idUsuario } }
            )
        }

        await Endereco.update(valores, { where: { codEndereco: id } })
        const dadosAtualizados = await Endereco.findByPk(id)
        
        res.status(200).json(dadosAtualizados)
    } catch (err) {
        console.error('Erro ao atualizar endereço', err)
        res.status(500).json({error: 'Erro ao atualizar endereço', err})
    }
}

const remover = async (req, res) => {
    const id = req.params.id
    const idUsuario = req.user.codUsuario

    try {
        const endereco = await Endereco.findOne({
            where: { codEndereco: id, idUsuario }
        })

        if (!endereco) {
            return res.status(404).json({message: 'Endereço não encontrado'})
        }

        // Não permitir remover se for o único endereço
        const totalEnderecos = await Endereco.count({ where: { idUsuario } })
        if (totalEnderecos === 1) {
            return res.status(400).json({message: 'Não é possível remover o único endereço'})
        }

        await Endereco.destroy({ where: { codEndereco: id } })
        res.status(200).json({message: 'Endereço removido com sucesso'})
    } catch (err) {
        console.error('Erro ao remover endereço', err)
        res.status(500).json({error: 'Erro ao remover endereço', err})
    }
}

module.exports = {
    cadastrar,
    listarPorUsuario,
    definirPrincipal,
    atualizar,
    remover
}