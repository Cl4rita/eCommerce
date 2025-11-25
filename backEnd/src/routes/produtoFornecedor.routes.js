const express = require('express')
const router = express.Router()

const produtoFornecedorController = require('../controllers/produtoFornecedor.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /produto-fornecedor - Vincular produto com fornecedor
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    produtoFornecedorController.vincularProdutoFornecedor
)

// GET /produto-fornecedor/produto/:idProduto - Listar fornecedores do produto
router.get(
    '/produto/:idProduto',
    authMiddleware,
    isAdminMiddleware,
    produtoFornecedorController.listarFornecedoresDoProduto
)

// GET /produto-fornecedor/fornecedor/:idFornecedor - Listar produtos do fornecedor
router.get(
    '/fornecedor/:idFornecedor',
    authMiddleware,
    isAdminMiddleware,
    produtoFornecedorController.listarProdutosDoFornecedor
)

// PATCH /produto-fornecedor/:id/custo - Atualizar custo
router.patch(
    '/:id/custo',
    authMiddleware,
    isAdminMiddleware,
    produtoFornecedorController.atualizarCusto
)

// DELETE /produto-fornecedor/:id - Remover vínculo
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    produtoFornecedorController.removerVinculo
)

module.exports = router