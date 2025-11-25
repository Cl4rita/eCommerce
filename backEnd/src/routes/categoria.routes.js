const express = require('express')
const router = express.Router()

const categoriaController = require('../controllers/categoriaProd.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /categorias - Criar categoria (apenas admin)
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.cadastrar
)

// GET /categorias - Listar todas categorias
router.get(
    '/',
    authMiddleware,
    categoriaController.listar
)

// GET /categorias/ativas - Listar categorias ativas
router.get(
    '/ativas',
    authMiddleware,
    categoriaController.listarAtivas
)

// GET /categorias/:id - Buscar categoria por ID
router.get(
    '/:id',
    authMiddleware,
    categoriaController.buscarPorId
)

// PUT /categorias/:id - Atualizar categoria
router.put(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.atualizar
)

// PATCH /categorias/:id/desativar - Desativar categoria
router.patch(
    '/:id/desativar',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.desativar
)

// PATCH /categorias/:id/ativar - Ativar categoria
router.patch(
    '/:id/ativar',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.ativar
)

// DELETE /categorias/:id - Deletar categoria
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.apagar
)

module.exports = router