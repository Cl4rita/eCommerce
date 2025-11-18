const Pedido = require('../model/Pedido')

const finalizarPedido = async (req,res) => {
    const { produtos, total } = req.body

    if(!produtos || produtos.length === 0){
        return res.status(400).json({message: 'Carrinho vazio'})
    }

    try{
        const pedido = await Pedido.create({
            produtos: JSON.stringify(produtos),
            total: total
        })
        res.status(201).json({message: 'Pedido finalizado com sucesso', pedido})
    }catch(err){
        res.status(500).json({error: 'Erro ao finalizar pedido'})
        console.error('Erro ao finalizar pedido', err)
    }
}

module.exports = { finalizarPedido }