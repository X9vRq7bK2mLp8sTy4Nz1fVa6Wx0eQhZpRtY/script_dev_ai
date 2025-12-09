import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { ConversationModel } from '@/lib/models/Conversation'

// GET - List all conversations for user
export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        const conversations = await ConversationModel.findByUserId(user.userId)

        return NextResponse.json({ conversations })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.error('List conversations error:', error)
        return NextResponse.json(
            { error: 'Failed to list conversations' },
            { status: 500 }
        )
    }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
    try {
        const user = requireAuth(request)
        const { title, environment } = await request.json()

        if (!title || !environment) {
            return NextResponse.json(
                { error: 'Title and environment are required' },
                { status: 400 }
            )
        }

        if (environment !== 'executor' && environment !== 'studio') {
            return NextResponse.json(
                { error: 'Environment must be "executor" or "studio"' },
                { status: 400 }
            )
        }

        const conversation = await ConversationModel.create(user.userId, title, environment)

        return NextResponse.json({ conversation }, { status: 201 })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.error('Create conversation error:', error)
        return NextResponse.json(
            { error: 'Failed to create conversation' },
            { status: 500 }
        )
    }
}
