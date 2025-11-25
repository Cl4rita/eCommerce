const express = require('express')
const router = express.Router()

const itemPedidoController = require('../controllers/itemPedido.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// POST /item-pedido - Adicionar item ao pedido
router.post(
    '/',
    authMiddleware,
    itemPedidoController.adicionarItem
)

// GET /item-pedido/pedido/:idPedido - Listar itens do pedido
router.get(
    '/pedido/:idPedido',
    authMiddleware,
    itemPedidoController.listarItensPorPedido
)

// PATCH /item-pedido/:id/quantidade - Atualizar quantidade do item
router.patch(
    '/:id/quantidade',
    authMiddleware,
    itemPedidoController.atualizarQuantidade
)

// DELETE /item-pedido/:id - Remover item do pedido
router.delete(
    '/:id',
    authMiddleware,
    itemPedidoController.removerItem
)

module.exports = router