const express = require('express')
const router = express.Router()

const usuarioController = require('../controllers/usuario.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Rota pública para cadastro
router.post('/', usuarioController.cadastrar)

// Atualizar perfil (autenticado)
router.put('/', authMiddleware, usuarioController.atualizar)

// Alterar senha (autenticado)
router.patch('/senha', authMiddleware, usuarioController.alterarSenha)

module.exports = router