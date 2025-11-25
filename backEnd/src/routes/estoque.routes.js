const express = require('express')
const router = express.Router()

const estoqueController = require('../controllers/estoque.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /estoque - Cadastrar movimento de estoque
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    estoqueController.cadastrar
)

// GET /estoque - Listar estoque
router.get(
    '/',
    authMiddleware,
    estoqueController.listar
)

// GET /estoque/produto/:idProduto - Buscar estoque por produto
router.get(
    '/produto/:idProduto',
    authMiddleware,
    estoqueController.buscarPorProduto
)

// PATCH /estoque/:id - Atualizar estoque
router.patch(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    estoqueController.atualizar
)

module.exports = router