import prisma from '../prismaClient.js'

export async function listarPromocoes() {
    return await prisma.promocoes.findMany({
        include: { produto_promocao: { select: { produto_id: true } } },
        orderBy: { nome: 'asc' }
    })
}

export async function criarPromocao(dados) {
    const { nome, tipoDesconto, desconto, dataInicio, dataFim, produtoIds } = dados

    const dataInicioValida = dataInicio ? new Date(dataInicio) : new Date();
    const dataFimValida = new Date(dataFim);

    return await prisma.promocoes.create({
        data: {
            nome,
            tipo_desconto: tipoDesconto,
            valor_desconto: Number(desconto),
            data_inicio: dataInicioValida,
            data_fim: dataFimValida,
            ativo: true,
            produto_promocao: produtoIds && produtoIds.length > 0 ? {
                create: produtoIds.map(id => ({ produto_id: Number(id) }))
            } : undefined
        },
        include: { produto_promocao: true }
    })
}

export async function atualizarPromocao(id, dados) {
    const { nome, desconto, tipoDesconto, dataInicio, dataFim, produtoIds } = dados
    const promocaoId = parseInt(id)

    return await prisma.$transaction(async (tx) => {

        const promocaoAtualizada = await tx.promocoes.update({
            where: { id: promocaoId },
            data: {
                nome,
                valor_desconto: Number(desconto),
                tipo_desconto: tipoDesconto,
                data_inicio: new Date(dataInicio),
                data_fim: new Date(dataFim),
            },
        })

        if (produtoIds !== undefined) {
            await tx.produto_promocao.deleteMany({
                where: { promocao_id: promocaoId }
            })

            if (produtoIds.length > 0) {
                await tx.produto_promocao.createMany({
                    data: produtoIds.map(pid => ({
                        produto_id: Number(pid),
                        promocao_id: promocaoId,
                    }))
                })
            }
        }

        if (tipoDesconto === "percentual" && (desconto < 1 || desconto > 100)) {
            throw new Error("O desconto percentual deve estar entre 1 e 100");
        }
        if (tipoDesconto === "valor" && desconto < 0) {
            throw new Error("O desconto em valor deve ser maior ou igual a 0");
        }
        return await tx.promocoes.findUnique({
            where: { id: promocaoId },
            include: { produto_promocao: { select: { produto_id: true } } }
        })
    })
}

export async function excluirPromocao(id) {
    return await prisma.promocoes.delete({ where: { id: parseInt(id) } })
}