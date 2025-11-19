const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')
const PORT = process.env.PORT
const hostname = process.env.DB_HOST

const authMiddleware = require('./middleware/auth.middleware')

const authController = require('./controller/auth.controller')

const usuarioController = require('./controller/usuario.controller')
const produtoController = require('./controller/produto.controller')
const estoqueController = require('./controller/estoque.controller')
const pedidoController = require('./controller/pedido.controller')


//Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//Rotas públicas
app.post('/usuario', usuarioController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req,res)=> {
    res.status(200).json({message: 'Aplicação rodando'})
})

//Rotas privadas
app.use(authMiddleware)

app.get('/usuario', usuarioController.listar)
app.put('/usuario', usuarioController.atualizar)
app.delete('/usuario', usuarioController.apagar)

app.post('/produto', produtoController.cadastrar)
app.get('/produto', produtoController.listar)
app.put('/produto', produtoController.atualizar)
app.delete('/produto', produtoController.apagar)

app.post('/estoque', estoqueController.cadastrar)
app.get('/estoque', estoqueController.listar)
app.put('/estoque', estoqueController.atualizar)
app.delete('/estoque', estoqueController.apagar)

//Conexão
conn.sync()
.then(()=> {
    app.listen(PORT, hostname, ()=> {
        console.log(`Aplicação rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=> {
    console.error('Erro ao rodar a aplicação')
})