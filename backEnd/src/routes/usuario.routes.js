const Usuario = require('../models/Usuario')
const { validaEmail, validaTelefone, validaCPF } = require('../utils/validacao')
const { hashSenha } = require('../utils/criptografia')

async function cadastrar(dados) {
    const { nome, email, telefone, cpf, identidade, senha, tipo_usuario } = dados

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
        throw new Error('CPF inválido')
    }

    if (senha.length < 6) {
        throw new Error('Senha deve ter no mínimo 6 caracteres')
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
    const novoUsuario = await Usuario.create({
        nome,
        email,
        telefone,
        cpf,
        identidade: identidade || null,
        senha: senhaBcrypt,
        tipo_usuario: tipo_usuario || 'CLIENTE'
    })

    // Retornar dados sem a senha
    const { senha: _, ...usuarioSemSenha } = novoUsuario.toJSON()
    return usuarioSemSenha
}

async function buscarUsuarioPorId(id) {
    const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['senha'] }
    })
    
    if (!usuario) {
        throw new Error('Usuário não encontrado')
    }
    
    return usuario
}

async function atualizarUsuario(id, dados) {
    const usuario = await Usuario.findByPk(id)
    
    if (!usuario) {
        throw new Error('Usuário não encontrado')
    }

    // Validar email se for fornecido
    if (dados.email && !validaEmail(dados.email)) {
        throw new Error('Email inválido')
    }

    // Validar telefone se for fornecido
    if (dados.telefone && !validaTelefone(dados.telefone)) {
        throw new Error('Telefone inválido')
    }

    // Verificar duplicidade de email
    if (dados.email && dados.email !== usuario.email) {
        const usuarioEmail = await Usuario.findOne({ where: { email: dados.email } })
        if (usuarioEmail) {
            throw new Error('Email já está cadastrado')
        }
    }

    await usuario.update(dados)
    
    // Retornar dados sem a senha
    const { senha: _, ...usuarioSemSenha } = usuario.toJSON()
    return usuarioSemSenha
}

async function alterarSenha(id, senhaAtual, novaSenha) {
    const usuario = await Usuario.findByPk(id)
    
    if (!usuario) {
        throw new Error('Usuário não encontrado')
    }

    // Verificar senha atual
    const { compareSenha } = require('../utils/criptografia')
    const senhaValida = await compareSenha(senhaAtual, usuario.senha)
    
    if (!senhaValida) {
        throw new Error('Senha atual incorreta')
    }

    if (novaSenha.length < 6) {
        throw new Error('Nova senha deve ter no mínimo 6 caracteres')
    }

    // Criptografar nova senha
    const novaSenhaBcrypt = await hashSenha(novaSenha)
    await usuario.update({ senha: novaSenhaBcrypt })

    return true
}

module.exports = { 
    cadastrar, 
    buscarUsuarioPorId, 
    atualizarUsuario, 
    alterarSenha 
}