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

        // Authenticate user
        const user = await UserModel.authenticate(username, password)

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            )
        }

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
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}
