const Produto = require('../model/Produto')
const Estoque = require('../model/Estoque')

const cadastrar = async (req,res) => {
    const valores = req.body

    if(!valores.idVendedor || !valores.idProduto || !valores.movimentacao || !valores.tipo){
        return res.status(400).json({message: 'Campos obrigatórios'})
    }
    try{
        const produto = await Produto.findByPk(valores.idProduto)

        if(!produto){
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        let novaQuantidade = produto.quantidade

        if(valores.tipo === 'ENTRADA'){
            novaQuantidade += valores.movimentacao
        }else if(valores.tipo === 'SAIDA'){
            if(produto.quantidade < valores.movimentacao){
                return res.status(400).json({message: 'Estoque Insuficiente'})
            }
            if(produto.quantidade === 0){
                return res.status(400).json({message: 'Estoque Zerado'})
            }
            novaQuantidade -= valores.movimentacao
        }else{
            return res.status(400).json({message: 'Inválido'})
        }

        await produto.update({quantidade: novaQuantidade})

        const dados = await Estoque.create({
            idProduto: valores.idProduto,
            idVendedor: valores.idVendedor,
            movimentacao: valores.movimentacao,
            tipo: valores.tipo
        })
        res.status(201).json({message: 'Estoque Atualizado', dados})
    }catch(err){
        res.status(500).json({error: 'Erro ao cadastrar'})
        console.error('Erro ao cadastrar', err)
    }
}

module.exports = { cadastrar }