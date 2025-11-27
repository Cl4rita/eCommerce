const Usuario = require('../models/Usuario')
const { validaEmail, validaTelefone, validaCPF } = require('../utils/validacao')
const { hashSenha } = require('../utils/criptografia')

async function cadastrar(dados) {
    const { nome, email, telefone, cpf, senha, tipo_usuario} = dados

    // -------- validações --------
    if (!nome || !email || !telefone || !cpf || !senha) {
        throw new Error('Campos obrigatórios não informados')
    }

    if (!validaEmail(email)) {
        throw new Error('Email inválido')
    }

    if (!validaTelefone(telefone)) {
        throw new Error('Telefone inválido')
    }

    if (!validaCPF(cpf)) {
        console.log('[usuario.service] CPF inválido recebido:', cpf)
        throw new Error('CPF inválido')
    }
    

    // -------- verificar duplicidade --------
    const usuarioEmail = await Usuario.findOne({ where: { email } })
    if (usuarioEmail) {
        throw new Error('Email já está cadastrado')
    }

    const usuarioCPF = await Usuario.findOne({ where: { cpf } })
    if (usuarioCPF) {
        throw new Error('CPF já está cadastrado')
    }

    // -------- criptografar senha --------
    const senhaBcrypt = await hashSenha(senha)

    // -------- criar no banco --------
    await Usuario.create({
        nome,
        email,
        telefone,
        cpf,
        tipo_usuario,
        senha: senhaBcrypt
    })

    return { ok: true }
}

async function atualizar(idUsuario, dados) {
    const { nome, email, telefone } = dados

    if (!nome || !email || !telefone) {
        throw new Error('Campos obrigatórios não informados')
    }

    if (!validaEmail(email)) {
        throw new Error('Email inválido')
    }

    if (!validaTelefone(telefone)) {
        throw new Error('Telefone inválido')
    }

    // verificar duplicidade de email em outro usuário
    const outro = await Usuario.findOne({ where: { email } })
    if (outro && outro.id !== idUsuario) {
        throw new Error('Email já está cadastrado por outro usuário')
    }

    await Usuario.update({ nome, email, telefone }, { where: { id: idUsuario } })

    const atualizado = await Usuario.findByPk(idUsuario)
    return atualizado
}

async function alterarSenha(idUsuario, senhaAtual, senhaNova) {
    if (!senhaAtual || !senhaNova) {
        throw new Error('Senha atual e nova são obrigatórias')
    }

    const usuario = await Usuario.findByPk(idUsuario)
    if (!usuario) throw new Error('Usuário não encontrado')

    const { compareSenha } = require('../utils/criptografia')
    const senhaValida = await compareSenha(senhaAtual, usuario.senha)
    if (!senhaValida) throw new Error('Senha atual inválida')

    const senhaHash = await hashSenha(senhaNova)
    await Usuario.update({ senha: senhaHash }, { where: { id: idUsuario } })
    return { ok: true }
}

module.exports = { cadastrar, atualizar, alterarSenha }