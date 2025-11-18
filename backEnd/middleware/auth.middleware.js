const { verificarToken } = require('../service/jwt.service')

function authorizMiddleware(req, res, next){
    const authorizHeader = req.headers['authorization']
    console.log('cabeçalho', authorizHeader)

    if(!authorizHeader){
        return res.status(401).json({error: 'Token não fornecido'})
    }
    const token = authorizHeader.split(' ')[1]
    console.log('token extraído: ', token)

    const dadosToken = verificarToken(token)
    console.log('dados do token: ', dadosToken)

    if(!dadosToken){
        return res.status(403).json({error: 'Token inválido'})
    }

    next()
}

module.exports = authorizMiddleware