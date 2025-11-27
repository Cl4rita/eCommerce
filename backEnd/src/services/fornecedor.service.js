const Fornecedor = require('../models/Fornecedor')

async function cadastrar(dados) {
    const fornecedor = await Fornecedor.create(dados)
    return fornecedor
}

async function listar() {
    return await Fornecedor.findAll({ order: [['nomeEmpresa', 'ASC']] })
}

async function buscarPorId(id) {
    const f = await Fornecedor.findByPk(id)
    if (!f) throw new Error('Fornecedor não encontrado')
    return f
}

async function atualizar(id, dados) {
    const f = await Fornecedor.findByPk(id)
    if (!f) throw new Error('Fornecedor não encontrado')
    await f.update(dados)
    return f
}

module.exports = { cadastrar, listar, buscarPorId, atualizar }
