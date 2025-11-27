const Endereco = require('../models/Endereco')

async function cadastrar(dados) {
    const endereco = await Endereco.create(dados)
    return endereco
}

async function listarPorUsuario(idUsuario) {
    return await Endereco.findAll({ where: { idUsuario }, order: [['is_principal', 'DESC']] })
}

async function definirPrincipal(id, idUsuario) {
    // remover principal anterior
    await Endereco.update({ is_principal: false }, { where: { idUsuario } })
    const end = await Endereco.findByPk(id)
    if (!end) throw new Error('Endereço não encontrado')
    await end.update({ is_principal: true })
    return end
}

async function atualizar(id, idUsuario, dados) {
    const end = await Endereco.findByPk(id)
    if (!end) throw new Error('Endereço não encontrado')
    if (end.idUsuario !== idUsuario) throw new Error('Acesso negado')
    await end.update(dados)
    return end
}

async function remover(id, idUsuario) {
    const end = await Endereco.findByPk(id)
    if (!end) throw new Error('Endereço não encontrado')
    if (end.idUsuario !== idUsuario) throw new Error('Acesso negado')
    await end.destroy()
    return true
}

module.exports = { cadastrar, listarPorUsuario, definirPrincipal, atualizar, remover }
