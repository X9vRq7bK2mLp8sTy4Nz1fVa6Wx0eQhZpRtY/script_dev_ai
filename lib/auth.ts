import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this'

export interface JWTPayload {
    userId: string
    username: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
        return null
    }
}

// Extract user from request
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
        return null
    }

    return verifyToken(token)
}

// Middleware helper to require authentication
export function requireAuth(request: NextRequest): JWTPayload {
    const user = getUserFromRequest(request)

    if (!user) {
        throw new Error('Unauthorized')
    }

    return user
}
