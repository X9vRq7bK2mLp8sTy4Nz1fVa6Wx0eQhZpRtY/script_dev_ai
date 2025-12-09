import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/lib/models/User'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existing = await UserModel.findByUsername(username)
        if (existing) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 409 }
            )
        }

        // Create new user
        const user = await UserModel.create(username, password)

        // Generate JWT token
        const token = generateToken({
            userId: user._id!.toString(),
            username: user.username
        })

        // Set httpOnly cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id!.toString(),
                username: user.username
            }
        })

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: false, // Allow in both HTTP and HTTPS
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        )
    }
}
