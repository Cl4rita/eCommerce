const express = require('express')
const router = express.Router()

const enderecoController = require('../controllers/endereco.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// POST /enderecos - Cadastrar endereço
router.post(
    '/',
    authMiddleware,
    enderecoController.cadastrar
)

// GET /enderecos - Listar endereços do usuário
router.get(
    '/',
    authMiddleware,
    enderecoController.listarPorUsuario
)

// PUT /enderecos/:id - Atualizar endereço
router.put(
    '/:id',
    authMiddleware,
    enderecoController.atualizar
)

// PATCH /enderecos/:id/principal - Definir como principal
router.patch(
    '/:id/principal',
    authMiddleware,
    enderecoController.definirPrincipal
)

// DELETE /enderecos/:id - Remover endereço
router.delete(
    '/:id',
    authMiddleware,
    enderecoController.remover
)

module.exports = router