import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface FileAttachment {
    filename: string
    content: string
    notes?: string
}

export interface MessageMetadata {
    files?: FileAttachment[]
    errors?: string
    diffApproval?: 'accepted' | 'rejected'
    generatedCode?: string
    rejectionReason?: string
}

export interface Message {
    _id?: ObjectId
    conversationId: ObjectId
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    metadata?: MessageMetadata
}

export class MessageModel {
    static async create(
        conversationId: string,
        role: 'user' | 'assistant' | 'system',
        content: string,
        metadata?: MessageMetadata
    ): Promise<Message> {
        const db = await getDatabase()

        const message: Message = {
            conversationId: new ObjectId(conversationId),
            role,
            content,
            timestamp: new Date(),
            metadata: metadata || {}
        }

        const result = await db.collection<Message>('messages').insertOne(message)
        return { ...message, _id: result.insertedId }
    }

    static async findByConversationId(conversationId: string): Promise<Message[]> {
        const db = await getDatabase()
        return db.collection<Message>('messages')
            .find({ conversationId: new ObjectId(conversationId) })
            .sort({ timestamp: 1 })
            .toArray()
    }

    static async updateMetadata(id: string, metadata: MessageMetadata): Promise<void> {
        const db = await getDatabase()
        await db.collection<Message>('messages').updateOne(
            { _id: new ObjectId(id) },
            { $set: { metadata } }
        )
    }

    static async getLatestCode(conversationId: string): Promise<string | null> {
        const db = await getDatabase()
        const message = await db.collection<Message>('messages')
            .findOne(
                {
                    conversationId: new ObjectId(conversationId),
                    role: 'assistant',
                    'metadata.generatedCode': { $exists: true }
                },
                { sort: { timestamp: -1 } }
            )

        return message?.metadata?.generatedCode || null
    }
}
