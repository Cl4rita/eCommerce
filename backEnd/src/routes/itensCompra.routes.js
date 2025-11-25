const express = require('express')
const router = express.Router()

const itensCompraController = require('../controllers/itensCompra.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// GET /itens-compra/compra/:idCompra - Listar itens da compra
router.get(
    '/compra/:idCompra',
    authMiddleware,
    isAdminMiddleware,
    itensCompraController.listarItensPorCompra
)

// PATCH /itens-compra/:id - Atualizar item da compra
router.patch(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    itensCompraController.atualizarItem
)

// DELETE /itens-compra/:id - Remover item da compra
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    itensCompraController.removerItem
)

module.exports = router