const express = require('express')
const router = express.Router()

const pagamentoController = require('../controllers/pagamento.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// POST /pagamentos - Criar pagamento
router.post(
    '/',
    authMiddleware,
    pagamentoController.criarPagamento
)

// GET /pagamentos/pedido/:idPedido - Listar pagamentos do pedido
router.get(
    '/pedido/:idPedido',
    authMiddleware,
    pagamentoController.listarPagamentosPedido
)

// GET /pagamentos/compra/:idCompra - Listar pagamentos da compra
router.get(
    '/compra/:idCompra',
    authMiddleware,
    pagamentoController.listarPagamentosCompra
)

// PATCH /pagamentos/:id/status - Atualizar status do pagamento
router.patch(
    '/:id/status',
    authMiddleware,
    pagamentoController.atualizarStatusPagamento
)

module.exports = router