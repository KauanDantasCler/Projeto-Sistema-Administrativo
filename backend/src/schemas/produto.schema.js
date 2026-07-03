
import { z } from 'zod'

export const produtoSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    preco: z.number().positive('Preço deve ser maior que 0'),
    ativo: z.boolean()
})