const Produto = require('../model/Produto')

const cadastrar = async (req,res) => {
    const valores = req.body

    if(Array.isArray(valores)){
        try{
            const dados = await Produto.bulkCreate(valores)
            res.status(201).json({message: 'Pedido finalizado com sucesso', dados})
        }catch(err){
            res.status(500).json({error: 'Erro ao finalizar pedido'})
            console.error('Erro ao finalizar pedido', err)
        }
    }
    else {
        if(!valores.nome || !valores.marca || !valores.descricao || !valores.preco || !valores.imagem){
            return res.status(400).json({message: 'Campos obrigatórios'})
        }
        try{
            const dados = await Produto.create(valores)
            res.status(201).json({message: 'Produto cadastrado', dados})
        }catch(err){
            res.status(500).json({error: 'Erro ao cadastrar'})
            console.error('Erro ao cadastrar', err)
        }
    }
}
const listar = async (req,res) => {
    try{
        const dados = await Produto.findAll()
        res.status(201).json(dados)
    }catch(err){
        res.status(500).json({error: 'Erro ao listar'})
        console.error('Erro ao listar', err)
    }
}

module.exports = { cadastrar, listar }