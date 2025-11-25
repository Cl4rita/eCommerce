const express = require('express')
const app = express()
const cors = require('cors')

// ------------------ Middlewares globais ------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// ------------------ Rotas ------------------
const usuarioRoutes = require('../routes/usuario.routes')
const authRoutes = require('../routes/auth.routes')
const produtoRoutes = require('../routes/produto.routes')
const pedidoRoutes = require('../routes/pedido.routes')
const categoriaRoutes = require('../routes/categoria.routes')
const estoqueRoutes = require('../routes/estoque.routes')
const fornecedorRoutes = require('../routes/fornecedor.routes')
const compraRoutes = require('../routes/compra.routes')
const entregaRoutes = require('../routes/entrega.routes')
const enderecoRoutes = require('../routes/endereco.routes')
const pagamentoRoutes = require('../routes/pagamento.routes')
const itemPedidoRoutes = require('../routes/itemPedido.routes')
const produtoFornecedorRoutes = require('../routes/produtoFornecedor.routes')
const itensCompraRoutes = require('../routes/itensCompra.routes')

app.use('/usuario', usuarioRoutes)
app.use('/auth', authRoutes)
app.use('/produto', produtoRoutes)
app.use('/pedido', pedidoRoutes)
app.use('/categoria', categoriaRoutes)
app.use('/estoque', estoqueRoutes)
app.use('/fornecedor', fornecedorRoutes)
app.use('/compra', compraRoutes)
app.use('/entrega', entregaRoutes)
app.use('/endereco', enderecoRoutes)
app.use('/pagamento', pagamentoRoutes)
app.use('/itemPedido', itemPedidoRoutes)
app.use('/produtoFornecedor', produtoFornecedorRoutes)
app.use('/itensCompra', itensCompraRoutes)

// Rota de saúde da API
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'API Pink Charme funcionando perfeitamente!',
        timestamp: new Date().toISOString()
    })
})

// Rota principal
app.get('/', (req, res) => {
    res.status(200).json({
        message: '🛍️ API Pink Charme - Sua Loja de SkinCare!',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            usuario: '/usuario',
            produto: '/produto',
            pedido: '/pedido',
            categoria: '/categoria',
            estoque: '/estoque',
            fornecedor: '/fornecedor',
            compra: '/compra',
            entrega: '/entrega',
            endereco: '/endereco',
            pagamento: '/pagamento',
            itemPedido: '/itemPedido',
            produtoFornecedor: '/produtoFornecedor',
            itensCompra: '/itensCompra'
        }
    })
})

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.originalUrl} não existe nesta API`
    })
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na API:', err)
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    })
})

module.exports = app