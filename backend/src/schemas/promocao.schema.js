import { z } from 'zod'

export const promocaoSchema = z.object({
    nome: z.string().min(2),
    tipoDesconto: z.string().min(1, "O tipo de desconto é obrigatório"),
    desconto: z.number().min(1),
    dataInicio: z.coerce.date().default(() => new Date()),
    dataFim: z.coerce.date(),
    produtoIds: z.array(z.number()).optional()
}).refine(d => d.dataFim > d.dataInicio, {
    message: 'Data fim deve ser posterior à data início',
    path: ['dataFim']
})