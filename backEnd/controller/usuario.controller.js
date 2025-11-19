const Usuario = require('../models/Usuario')
const { hashSenha } = require('../service/bcrypt.service')

const Usuario = require('../model/Usuario')

const { validaCPF } = require('../utils/validar_cpf')

const cadastrar = async (req,res)=>{
    const valores = req.body

    if( !valores.nome || 
        !valores.email ||
        !valores.cpf ||
        !valores.telefone ||
        !valores.tipo_usuario ||
        !valores.senha){

            return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    const nomeRegex = /^[A-Za-zÀ-ÿ\s]{3,40}$/
    if(!nomeRegex.test(valores.nome)){
        return res.status(400).json({message: 'Nome inválido! Use apenas letras e espaços.'})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(valores.email)){
        return res.status(400).json({message: 'E-mail inválido!'})
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if(!cpfRegex.test(valores.cpf)){
        return res.status(400).json({message: 'CPF inválido! Formato esperado: 000.000.000-00'})
    }

    valores.cpf = valores.cpf.replace(/[.-]/g, '')
    
    const telefoneRegex = /^(?:\(\d{2,3}\)\s?)?\d{4,5}-?\d{4}$/
    if(!telefoneRegex.test(valores.telefone)){
        return res.status(400).json({message: 'Telefone inválido! Formato esperado: (11) 91234-5678'})
    }

    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if(!senhaRegex.test(valores.senha)){
        return res.status(400).json({message: 'Senha inválida! Deve ter pelo menos 8 caracteres e conter letras e números.'})
    }

    if(!validaCPF(valores.cpf)){
        return res.status(400).json({message: 'CPF inválido! Dígitos verificadores incorretos.'})
    }

    try{
        const dados = await Usuario.create(valores)
        res.status(201).json({message: 'Usuário Cadastrado', dados})
    }catch(err){
        console.error('Erro ao cadastrar os dados',err)
        res.status(500).json({message: "Erro ao cadastrar os dados!"})
    }
}

const listar  = async (req,res)=>{
    try{
        const dados = await Usuario.findAll()
        res.status(200).json(dados)
    }catch(err){
        res.status(500).json({message: 'Erro ao listar os dados'})
        console.error('Erro ao listar os dados',err)
    }
}

const atualizar = async (req,res) => {
    const id = req.params.id
    const valores = req.body

    if( !valores.id ||
        !valores.nome || 
        !valores.email ||
        !valores.cpf ||
        !valores.telefone ||
        !valores.tipo_usuario ||
        !valores.senha){

            return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    const nomeRegex = /^[A-Za-zÀ-ÿ\s]{3,40}$/
    if(!nomeRegex.test(valores.nome)){
        return res.status(400).json({message: 'Nome inválido! Use apenas letras e espaços.'})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(valores.email)){
        return res.status(400).json({message: 'E-mail inválido!'})
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if(!cpfRegex.test(valores.cpf)){
        return res.status(400).json({message: 'CPF inválido! Formato esperado: 000.000.000-00'})
    }

    valores.cpf = valores.cpf.replace(/[.-]/g, '')
    
    const telefoneRegex = /^(?:\(\d{2,3}\)\s?)?\d{4,5}-?\d{4}$/
    if(!telefoneRegex.test(valores.telefone)){
        return res.status(400).json({message: 'Telefone inválido! Formato esperado: (11) 91234-5678'})
    }

    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if(!senhaRegex.test(valores.senha)){
        return res.status(400).json({message: 'Senha inválida! Deve ter pelo menos 8 caracteres e conter letras e números.'})
    }

    if(!validaCPF(valores.cpf)){
        return res.status(400).json({message: 'CPF inválido! Dígitos verificadores incorretos.'})
    }

    try{
        let dados = await Controle.findByPk(id)
        if(dados){
            await Controle.update(valores, {where: {id:id}})
            dados = await Controle.findByPk(id)
            res.status(200).json({message: 'Dados Atualizados', dados})
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
    const valores = req.body

    if(!valores.id){
            return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }
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