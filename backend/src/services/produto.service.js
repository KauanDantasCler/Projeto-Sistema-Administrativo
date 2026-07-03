import prisma from '../prismaClient.js'

export async function listarProdutos() {
    return await prisma.produtos.findMany({
        orderBy: { nome: 'asc' },
        include: {
            produto_promocao: {
                include: {
                    promocoes: {
                        select: {
                            id: true,
                            nome: true,
                            tipo_desconto: true,
                            valor_desconto: true,
                            ativo: true,
                        }
                    }
                },
                where: {
                    promocoes: { ativo: true }
                }
            }
        }
    })
}

export async function buscarProduto(id) {
    return await prisma.produtos.findUnique({ where: { id: parseInt(id) } })
}

export async function criarProduto(dadosProduto) {
    const { nome, descricao, preco, ativo } = dadosProduto
    return await prisma.produtos.create({
        data: { nome, descricao, preco, ativo }
    })
}

export async function atualizarProduto(id, dadosProduto) {
    const { nome, descricao, preco, ativo } = dadosProduto
    return await prisma.produtos.update({
        where: { id: parseInt(id) },
        data: { nome, descricao, preco, ativo }
    })
}

export async function excluirProduto(id) {
    return await prisma.produtos.delete({ where: { id: parseInt(id) } })
}