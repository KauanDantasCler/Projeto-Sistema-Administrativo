import * as authService from '../services/auth.service.js'


function formatarRespostaBigInt(dados) {
    return JSON.parse(
        JSON.stringify(dados, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function login(req, res) {
    const { email, senha } = req.body

    try {
        const resultadoLogin = await authService.autenticarLogin(email, senha)
        return res.json(formatarRespostaBigInt(resultadoLogin))
    } catch (error) {
        console.error('Erro no login:', error)
        if (error.message === 'Credenciais inválidas') {
            return res.status(401).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}