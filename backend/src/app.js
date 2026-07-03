import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import produtoRoutes from './routes/produto.routes.js'
import promocaoRoutes from './routes/promocao.routes.js'

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())

app.get('/api/hello', (req, res) => {
    res.json({ mensagem: 'Olá do backend!', ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/produtos', produtoRoutes)
app.use('/api/promocoes', promocaoRoutes)

export default app;