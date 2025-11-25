const express = require('express')
const router = express.Router()

const fornecedorController = require('../controllers/fornedor.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /fornecedores - Cadastrar fornecedor
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.cadastrar
)

// GET /fornecedores - Listar fornecedores
router.get(
    '/',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.listar
)

// GET /fornecedores/:id - Buscar fornecedor por ID
router.get(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.buscarPorId
)

// PUT /fornecedores/:id - Atualizar fornecedor
router.put(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.atualizar
)

module.exports = router