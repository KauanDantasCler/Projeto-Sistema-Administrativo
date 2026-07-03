
import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { promocaoSchema } from '../schemas/promocao.schema.js'
import * as c from '../controllers/promocao.controller.js'

const router = Router()
router.use(auth)

router.get(
    '/',
    c.listarPromocoes
)

router.post('/', 
    validate(promocaoSchema), 
    c.criarPromocao
)
router.put('/:id', 
    validate(promocaoSchema), 
    c.atualizarPromocao
)
router.delete('/:id', 
    c.excluirPromocao
)

export default router