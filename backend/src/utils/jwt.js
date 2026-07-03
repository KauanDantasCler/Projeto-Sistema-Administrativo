
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET
const EXPIRES = process.env.JWT_EXPIRES_IN || '8h'

export function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES })
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET)
}