
import { z } from 'zod'
import { validarCPF } from '../utils/cpf.js'

export const usuarioSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    cpf: z.string().refine(validarCPF, { message: 'CPF inválido' }),
    senha: z.string().min(8),
    perfil: z.enum(['ADMIN', 'FUNCIONARIO']).optional()
})


export const usuarioUpdateSchema = usuarioSchema.omit({ cpf: true, senha: true })