import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/mongodb'
import { UserModel } from '@/lib/models/User'

export async function GET(request: NextRequest) {
    try {
        // Initialize database and collections
        await initializeDatabase()

        // Seed admin user if doesn't exist
        await UserModel.seedAdminUser()

        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully'
        })
    } catch (error: any) {
        console.error('Init error:', error)
        return NextResponse.json(
            { error: 'Failed to initialize database' },
            { status: 500 }
        )
    }
}
