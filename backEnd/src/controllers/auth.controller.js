const Cliente = require('../model/Cliente')
const { compareSenha } = require('../service/bcrypt.service')
const { gerarToken } = require('../service/jwt.service')

const login = async (req,res)=>{
    const valores = req.body
    console.log('body: ',valores)

    try{
        const cliente = await Cliente.findOne({where: { email: valores.email}})

        if(!cliente){
            return res.status(404).json({error: "Cliente não encontrado!"})
        }

        const senhaValida = await compareSenha(valores.senha, cliente.senha)
        console.log('senha válida: ', senhaValida)

        if(!senhaValida){
            return res.status(401).json({error: "Senha inválida!"})
        }

        const token = gerarToken({
            codCliente: cliente.codCliente,
            email: cliente.email
        })

        res.status(200).json({message: "Login realizado com sucesso!", token})

    }catch(err){
        res.status(500).json({error: "Erro ao realizar o login!"})
    }
}

module.exports = { login }