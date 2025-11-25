const express = require('express')
const router = express.Router()

const compraController = require('../controllers/compra.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /compras - Criar compra
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    compraController.criarCompra
)

// GET /compras - Listar compras
router.get(
    '/',
    authMiddleware,
    isAdminMiddleware,
    compraController.listarCompras
)

// GET /compras/:id - Buscar compra por ID
router.get(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    compraController.buscarCompraPorId
)

// PATCH /compras/:id/receber - Receber/atualizar compra
router.patch(
    '/:id/receber',
    authMiddleware,
    isAdminMiddleware,
    compraController.receberCompra
)

module.exports = router