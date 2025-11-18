const jwt = require('jsonwebtoken')
const SEGREDO = process.env.JWT_SECRET

function gerarToken(payload) {
    return jwt.sign(payload, SEGREDO, {expiresIn: process.env.JWT_EXPIRES_IN})
}
function verificarToken(token){
    try{
        return jwt.verify(token, SEGREDO)
    }catch(err){
        console.error('Erro ao verficar token')
        return null
    }
}

module.exports = { gerarToken, verificarToken }