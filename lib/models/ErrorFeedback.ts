import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface ErrorFeedback {
    _id?: ObjectId
    conversationId: ObjectId
    messageId: ObjectId
    errorText: string
    context: string
    resolvedCode?: string
    createdAt: Date
}

export class ErrorFeedbackModel {
    static async create(
        conversationId: string,
        messageId: string,
        errorText: string,
        context: string
    ): Promise<ErrorFeedback> {
        const db = await getDatabase()

        const feedback: ErrorFeedback = {
            conversationId: new ObjectId(conversationId),
            messageId: new ObjectId(messageId),
            errorText,
            context,
            createdAt: new Date()
        }

        const result = await db.collection<ErrorFeedback>('error_feedback').insertOne(feedback)
        return { ...feedback, _id: result.insertedId }
    }

    static async findByConversationId(conversationId: string): Promise<ErrorFeedback[]> {
        const db = await getDatabase()
        return db.collection<ErrorFeedback>('error_feedback')
            .find({ conversationId: new ObjectId(conversationId) })
            .sort({ createdAt: -1 })
            .toArray()
    }

    static async markResolved(id: string, resolvedCode: string): Promise<void> {
        const db = await getDatabase()
        await db.collection<ErrorFeedback>('error_feedback').updateOne(
            { _id: new ObjectId(id) },
            { $set: { resolvedCode } }
        )
    }
}
