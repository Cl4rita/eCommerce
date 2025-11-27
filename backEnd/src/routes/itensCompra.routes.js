const express = require('express')
const router = express.Router()

const itemCompraController = require('../controllers/itemCompra.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// GET /itens-compra/compra/:idCompra - Listar itens da compra
router.get(
    '/compra/:idCompra',
    authMiddleware,
    isAdminMiddleware,
    itemCompraController.listarItensPorCompra
)

// PATCH /itens-compra/:id - Atualizar item da compra
router.patch(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    itemCompraController.atualizarItem
)

// DELETE /itens-compra/:id - Remover item da compra
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    itemCompraController.removerItem
)

module.exports = router