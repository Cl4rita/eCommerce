const Usuario = require('../models/Usuario')
const { hashSenha } = require('../service/bcrypt.service')

const cadastrar = async (req, res)=> {
    const valores = req.body

    if(!valores.marca || !valores.modelo || !valores.tipo || !valores.valor){
        return res.status(400).json({error: 'Todos os campos são obrigatórios!'})
    }

    try{
        if(valores.senha){
            valores.senha = await hashSenha(valores.senha)
        }

        const dados = await Controle.create(valores)
        res.status(201).json(dados)
    }catch(err){
        console.error('Erro ao cadastrar os dados', err)
        res.status(500).json({error: 'Erro ao cadastrar os dados'})
    }
}
const listar = async (req, res) => {
    try{
        const dados = await Controle.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao listar os dados', err)
        res.status(500).json({error: 'Erro ao listar os dados'})
    }
}

const atualizar = async (req,res) => {
    const id = req.params.id
    const valores = req.body
    try{
        let dados = await Controle.findByPk(id)
        if(dados){
            await Controle.update(valores, {where: {id:id}})
            dados = await Controle.findByPk(id)
            res.status(200).json(dados)
        }else{
            res.status(404).json({message: 'Erro ao encontrar os dados'})
        }
    }catch(err){
        console.error('Erro ao atualizar os dados', err)
        res.status(500).json({error: 'Erro ao atualizar os dados'})
    }
}
const apagar = async (req,res) => {
    const id = req.params.id
    try{
        let dados = await Controle.findByPk(id)
        if(dados){
            await Controle.destroy({where: {id:id}})
            res.status(204).json({message: 'Dados apagados com sucesso'})
        }else{
            res.status(404).json({message: 'Erro ao encontrar os dados'})
        }
    }catch(err){
        console.error('Erro ao apagar os dados', err)
        res.status(500).json({error: 'Erro ao apagar os dados'})
    }
}

module.exports = { cadastrar, listar, atualizar, apagar }