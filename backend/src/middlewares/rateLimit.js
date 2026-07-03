import rateLimit from 'express-rate-limit'


export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Muitas tentativas de login. Tente novamente após 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
})


export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Limite de requisições excedido. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
})