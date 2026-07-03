import { Router } from 'express'
import { validate } from '../middlewares/validate.js'
import { authRateLimiter } from '../middlewares/rateLimit.js'
import { loginSchema } from '../schemas/auth.schema.js'
import { login } from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', authRateLimiter, validate(loginSchema), login)


export default router