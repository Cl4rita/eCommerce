const authService = require('../services/auth.service')

async function login(req, res) {
    try {
        const { email, senha } = req.body
        const resultado = await authService.login({ email, senha })
        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro no login:', err)
        const status = err.message === 'Usuário não encontrado' || err.message === 'Senha inválida' ? 401 : 500
        return res.status(status).json({ error: err.message || 'Erro ao realizar o login' })
    }
}

module.exports = { login }