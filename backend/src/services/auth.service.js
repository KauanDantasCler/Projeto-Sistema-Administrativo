import prisma from '../prismaClient.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jwt.js'

export async function autenticarLogin(email, senha) {
    const usuario = await prisma.usuarios.findUnique({ where: { email } })

    if (!usuario) {
        throw new Error('Credenciais inválidas')
    }

    const valid = await bcrypt.compare(senha, usuario.senha_hash)
    if (!valid) {
        throw new Error('Credenciais inválidas')
    }

    const token = generateToken({
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil
    })

    return {
        token,
        usuario: {
            id: usuario.id,
            email: usuario.email,
            perfil: usuario.perfil
        }
    }
}