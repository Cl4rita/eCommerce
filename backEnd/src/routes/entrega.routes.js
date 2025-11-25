const express = require('express')
const router = express.Router()

const entregaController = require('../controllers/entrega.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /entregas - Criar entrega
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    entregaController.criarEntrega
)

// GET /entregas/pedido/:idPedido - Buscar entrega por pedido
router.get(
    '/pedido/:idPedido',
    authMiddleware,
    entregaController.buscarEntregaPorPedido
)

// PATCH /entregas/:id/status - Atualizar status da entrega
router.patch(
    '/:id/status',
    authMiddleware,
    isAdminMiddleware,
    entregaController.atualizarStatusEntrega
)

// PATCH /entregas/:id/rastreio - Atualizar código de rastreio
router.patch(
    '/:id/rastreio',
    authMiddleware,
    isAdminMiddleware,
    entregaController.atualizarCodigoRastreio
)

module.exports = router