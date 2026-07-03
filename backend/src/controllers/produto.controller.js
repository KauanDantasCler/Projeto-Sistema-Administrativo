import * as produtoService from '../services/produto.service.js'

function formatarRespostaBigInt(dados) {
    return JSON.parse(
        JSON.stringify(dados, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    )
}

export async function listarProdutos(req, res) {
    try {
        const produtos = await produtoService.listarProdutos()
        res.json(formatarRespostaBigInt(produtos))
    } catch (error) {
        console.error('Erro ao listar produtos:', error)
        res.status(500).json({ error: 'Erro ao listar produtos' })
    }
}

export async function buscarProduto(req, res) {
    const { id } = req.params
    try {
        const produto = await produtoService.buscarProduto(id)
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' })
        res.json(produto)
    } catch (error) {
        console.error('Erro ao buscar produto:', error)
        res.status(500).json({ error: 'Erro ao buscar produto' })
    }
}

export async function criarProduto(req, res) {
    try {
        const novoProduto = await produtoService.criarProduto(req.body)
        res.status(201).json(novoProduto)
    } catch (error) {
        console.error('Erro ao criar produto:', error)
        res.status(500).json({ error: 'Erro ao criar produto' })
    }
}

export async function atualizarProduto(req, res) {
    const { id } = req.params
    try {
        const produtoAtualizado = await produtoService.atualizarProduto(id, req.body)
        res.json(produtoAtualizado)
    } catch (error) {
        console.error('Erro ao atualizar produto:', error)
        res.status(500).json({ error: 'Erro ao atualizar produto' })
    }
}

export async function excluirProduto(req, res) {
    const { id } = req.params
    try {
        await produtoService.excluirProduto(id)
        res.status(204).send()
    } catch (error) {
        console.error('Erro ao excluir produto:', error)
        res.status(500).json({ error: 'Erro ao excluir produto' })
    }
}