import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'
import { hashPassword, verifyPassword } from '../auth'

export interface User {
    _id?: ObjectId
    username: string
    passwordHash: string
    createdAt: Date
    lastLogin?: Date
}

export class UserModel {
    static async create(username: string, password: string): Promise<User> {
        const db = await getDatabase()
        const passwordHash = await hashPassword(password)

        const user: User = {
            username,
            passwordHash,
            createdAt: new Date()
        }

        const result = await db.collection<User>('users').insertOne(user)
        return { ...user, _id: result.insertedId }
    }

    static async findByUsername(username: string): Promise<User | null> {
        const db = await getDatabase()
        return db.collection<User>('users').findOne({ username })
    }

    static async findById(id: string): Promise<User | null> {
        const db = await getDatabase()
        return db.collection<User>('users').findOne({ _id: new ObjectId(id) })
    }

    static async authenticate(username: string, password: string): Promise<User | null> {
        const user = await this.findByUsername(username)

        if (!user) {
            return null
        }

        const isValid = await verifyPassword(password, user.passwordHash)

        if (!isValid) {
            return null
        }

        // Update last login
        const db = await getDatabase()
        await db.collection<User>('users').updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        )

        return user
    }

    static async seedAdminUser(): Promise<void> {
        const existing = await this.findByUsername('admin')

        if (existing) {
            console.log('ℹ️  Admin user already exists')
            return
        }

        await this.create('admin', 'admin1234')
        console.log('✅ Created admin user (username: admin, password: admin1234)')
    }
}
