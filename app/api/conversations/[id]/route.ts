import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { ConversationModel } from '@/lib/models/Conversation'
import { MessageModel } from '@/lib/models/Message'

// GET - Get conversation with all messages
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = requireAuth(request)
        const { id } = params

        const conversation = await ConversationModel.findById(id)

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            )
        }

        // Verify ownership
        if (conversation.userId.toString() !== user.userId) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const messages = await MessageModel.findByConversationId(id)

        return NextResponse.json({ conversation, messages })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.error('Get conversation error:', error)
        return NextResponse.json(
            { error: 'Failed to get conversation' },
            { status: 500 }
        )
    }
}

// DELETE - Delete conversation
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = requireAuth(request)
        const { id } = params

        const conversation = await ConversationModel.findById(id)

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            )
        }

        // Verify ownership
        if (conversation.userId.toString() !== user.userId) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        await ConversationModel.delete(id)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.error('Delete conversation error:', error)
        return NextResponse.json(
            { error: 'Failed to delete conversation' },
            { status: 500 }
        )
    }
}
