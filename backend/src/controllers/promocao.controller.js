import * as promocaoService from '../services/promocao.service.js'


function formatarRespostaBigInt(dados) {
    return JSON.parse(
        JSON.stringify(dados, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function listarPromocoes(req, res) {
    try {
        const promocoes = await promocaoService.listarPromocoes()
        res.json(formatarRespostaBigInt(promocoes))
    } catch (error) {
        console.error('Erro ao listar promoções:', error)
        res.status(500).json({ error: 'Erro ao listar promoções' })
    }
}

export async function criarPromocao(req, res) {
    try {
        const novaPromocao = await promocaoService.criarPromocao(req.body)
        res.status(201).json(formatarRespostaBigInt(novaPromocao))
    } catch (error) {
        console.error('Erro ao criar promoção:', error)
        return res.status(500).json({ error: 'Erro interno ao criar promoção' })
    }
}

export async function atualizarPromocao(req, res) {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ error: 'ID da promoção é obrigatório' })
    }

    const idConvertido = parseInt(id)
    if (isNaN(idConvertido)) {
        return res.status(400).json({ error: 'ID da promoção inválido' })
    }
    try {
        const promocaoAtualizada = await promocaoService.atualizarPromocao(idConvertido, req.body)
        res.json(formatarRespostaBigInt(promocaoAtualizada))
    } catch (error) {
        console.error('Erro ao atualizar promoção:', error)
        res.status(500).json({ error: 'Erro ao atualizar promoção' })
    }
}

export async function excluirPromocao(req, res) {
    const { id } = req.params
    try {
        await promocaoService.excluirPromocao(id)
        res.status(204).send()
    } catch (error) {
        console.error('Erro ao excluir promoção:', error)
        res.status(500).json({ error: 'Erro ao excluir promoção' })
    }
}