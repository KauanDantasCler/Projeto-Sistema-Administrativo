
export function checkRole(rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user || !req.user.perfil) {
            return res.status(403).json({ error: 'Acesso negado: Perfil não identificado.' })
        }

        if (!rolesPermitidos.includes(req.user.perfil)) {
            return res.status(403).json({ error: 'Acesso negado: Você não tem permissão para realizar esta ação.' })
        }

        next()
    }
}