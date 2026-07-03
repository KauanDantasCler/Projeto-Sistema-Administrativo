import * as usuarioService from '../services/usuario.service.js'

function formatarRespostaBigInt(dados) {
    return JSON.parse(
        JSON.stringify(dados, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuarioService.listarUsuarios()
        res.json(formatarRespostaBigInt(usuarios))
    } catch (error) {
        console.error('Erro ao listar usuários:', error)
        res.status(500).json({ error: 'Erro ao listar usuários' })
    }
}

export async function criarUsuario(req, res) {
    try {
        const novoUsuario = await usuarioService.criarUsuario(req.body)
        res.status(201).json(formatarRespostaBigInt(novoUsuario))
    } catch (error) {
        console.error('Erro ao criar usuário:', error)
        if (error.message === 'Email já cadastrado') {
            return res.status(409).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Erro ao criar usuário' })
    }
}

export async function atualizarUsuario(req, res) {
    const { id } = req.params
    try {
        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, req.body)
        res.json(formatarRespostaBigInt(usuarioAtualizado))
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error)
        if (error.message === 'Email já cadastrado') {
            return res.status(409).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
}

export async function excluirUsuario(req, res) {
    const { id } = req.params
    const idUsuarioLogado = req.user ? req.user.id : null

    try {
        await usuarioService.excluirUsuario(id, idUsuarioLogado)
        res.status(204).send()
    } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        if (error.message === 'Não é permitido excluir a si mesmo') {
            return res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: 'Erro ao excluir usuário' })
    }
}