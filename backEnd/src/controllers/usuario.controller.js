const usuarioService = require('../services/usuario.service')

async function cadastrar(req, res) {
    try {
        const dados = req.body

        const resultado = await usuarioService.cadastrar(dados)

        return res.status(201).json({ mensage: 'Usuário cadastrado com sucesso' })

    } catch (err) {
        console.error('Erro no controller de cadastro:', err)
        return res.status(500).json({ mensage: 'Erro ao cadastrar usuário', err: err.message || err })
    }
}

async function atualizar(req, res) {
    try {
        const idUsuario = req.user && (req.user.codUsuario || req.user.id)
        const dados = req.body

        if (!idUsuario) return res.status(401).json({ message: 'Usuário não autenticado' })

        const atualizado = await usuarioService.atualizar(idUsuario, dados)
        return res.status(200).json(atualizado)
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err)
        return res.status(500).json({ message: 'Erro ao atualizar usuário', err: err.message || err })
    }
}

async function alterarSenha(req, res) {
    try {
        const idUsuario = req.user && (req.user.codUsuario || req.user.id)
        const { senhaAtual, novaSenha } = req.body

        if (!idUsuario) return res.status(401).json({ message: 'Usuário não autenticado' })

        await usuarioService.alterarSenha(idUsuario, senhaAtual, novaSenha)
        return res.status(200).json({ message: 'Senha alterada com sucesso' })
    } catch (err) {
        console.error('Erro ao alterar senha:', err)
        return res.status(400).json({ message: err.message || 'Erro ao alterar senha' })
    }
}

module.exports = { cadastrar, atualizar, alterarSenha }