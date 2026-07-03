import prisma from '../prismaClient.js'
import bcrypt from 'bcrypt'

const ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10

function mascararCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-**')
}

export async function listarUsuarios() {
    const usuarios = await prisma.usuarios.findMany({
        select: { id: true, nome: true, email: true, perfil: true, cpf: true },
        orderBy: { email: 'asc' }
    })
    return usuarios.map(u => ({ ...u, cpf: mascararCPF(u.cpf) }))
}

export async function criarUsuario(dadosUsuario) {
    const { nome, email, senha, perfil, cpf, ativo } = dadosUsuario


    const nomeSalvar = nome || email.split('@')[0]

    const ativoSalvar = ativo !== undefined ? ativo : true

    try {
        const hash = await bcrypt.hash(senha, ROUNDS)
        const novoUsuario = await prisma.usuarios.create({
            data: {
                nome: nomeSalvar,
                email,
                senha_hash: hash,
                perfil,
                cpf,
                ativo: ativoSalvar
            }
        })
        return { id: novoUsuario.id, email: novoUsuario.email, perfil: novoUsuario.perfil }
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            throw new Error('Email já cadastrado')
        }
        throw error
    }
}

export async function atualizarUsuario(id, dadosUsuario) {
    const { nome, email, perfil } = dadosUsuario
    try {
        const usuarioAtualizado = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: { nome, email, perfil }
        })
        return { id: usuarioAtualizado.id, nome: usuarioAtualizado.nome, email: usuarioAtualizado.email, perfil: usuarioAtualizado.perfil }
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            throw new Error('Email já cadastrado')
        }
        throw error
    }
}

export async function excluirUsuario(id, idUsuarioLogado) {
    if (parseInt(id) === idUsuarioLogado) {
        throw new Error('Não é permitido excluir a si mesmo')
    }
    return await prisma.usuarios.delete({ where: { id: parseInt(id) } })
}