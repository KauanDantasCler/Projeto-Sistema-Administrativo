
import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { checkRole } from '../middlewares/checkRole.js'
import { validate } from '../middlewares/validate.js'
import { usuarioSchema, usuarioUpdateSchema } from '../schemas/usuario.schema.js'
import * as c from '../controllers/usuario.controller.js'

const router = Router()
router.use(auth)


router.use(checkRole(['ADMIN']))

router.get('/', c.listarUsuarios)

router.post(
    '/',
    validate(usuarioSchema),
    c.criarUsuario
)



router.put(
    '/:id',
    validate(usuarioUpdateSchema),
    c.atualizarUsuario
)
router.delete(
    '/:id',
    c.excluirUsuario
)


export default router