import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface Conversation {
    _id?: ObjectId
    userId: ObjectId
    title: string
    environment: 'executor' | 'studio'
    createdAt: Date
    updatedAt: Date
    metadata: {
        totalMessages: number
        lastMessageAt?: Date
    }
}

export class ConversationModel {
    static async create(
        userId: string,
        title: string,
        environment: 'executor' | 'studio'
    ): Promise<Conversation> {
        const db = await getDatabase()

        const conversation: Conversation = {
            userId: new ObjectId(userId),
            title,
            environment,
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: {
                totalMessages: 0
            }
        }

        const result = await db.collection<Conversation>('conversations').insertOne(conversation)
        return { ...conversation, _id: result.insertedId }
    }

    static async findById(id: string): Promise<Conversation | null> {
        const db = await getDatabase()
        return db.collection<Conversation>('conversations').findOne({ _id: new ObjectId(id) })
    }

    static async findByUserId(userId: string): Promise<Conversation[]> {
        const db = await getDatabase()
        return db.collection<Conversation>('conversations')
            .find({ userId: new ObjectId(userId) })
            .sort({ updatedAt: -1 })
            .toArray()
    }

    static async updateTitle(id: string, title: string): Promise<void> {
        const db = await getDatabase()
        await db.collection<Conversation>('conversations').updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, updatedAt: new Date() } }
        )
    }

    static async updateMetadata(id: string, lastMessageAt: Date): Promise<void> {
        const db = await getDatabase()
        await db.collection<Conversation>('conversations').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { 'metadata.lastMessageAt': lastMessageAt, updatedAt: new Date() },
                $inc: { 'metadata.totalMessages': 1 }
            }
        )
    }

    static async delete(id: string): Promise<void> {
        const db = await getDatabase()
        await db.collection<Conversation>('conversations').deleteOne({ _id: new ObjectId(id) })
    }
}
