import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { produtoSchema } from '../schemas/produto.schema.js'
import * as c from '../controllers/produto.controller.js'

const router = Router()
router.use(auth)

router.get(
    '/',
    c.listarProdutos
)

router.get(
    '/:id',
    c.buscarProduto
)

router.post(
    '/',
    validate(produtoSchema),
    c.criarProduto
)
router.put(
    '/:id',
    validate(produtoSchema),
    c.atualizarProduto
)
router.delete(
    '/:id',
    c.excluirProduto
)

export default router