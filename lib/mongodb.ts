import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
    const client = await clientPromise
    return client.db('SCRIPT_DEV_MGMT')
}

// Initialize database and collections
export async function initializeDatabase() {
    try {
        const db = await getDatabase()

        // Create collections if they don't exist
        const collections = await db.listCollections().toArray()
        const collectionNames = collections.map(c => c.name)

        // Users collection
        if (!collectionNames.includes('users')) {
            await db.createCollection('users')
            await db.collection('users').createIndex({ username: 1 }, { unique: true })
            console.log('✅ Created users collection')
        }

        // Conversations collection
        if (!collectionNames.includes('conversations')) {
            await db.createCollection('conversations')
            await db.collection('conversations').createIndex({ userId: 1, updatedAt: -1 })
            console.log('✅ Created conversations collection')
        }

        // Messages collection
        if (!collectionNames.includes('messages')) {
            await db.createCollection('messages')
            await db.collection('messages').createIndex({ conversationId: 1, timestamp: 1 })
            console.log('✅ Created messages collection')
        }

        // Error feedback collection
        if (!collectionNames.includes('error_feedback')) {
            await db.createCollection('error_feedback')
            await db.collection('error_feedback').createIndex({ conversationId: 1, createdAt: -1 })
            console.log('✅ Created error_feedback collection')
        }

        console.log('✅ Database initialized successfully')
        return true
    } catch (error) {
        console.error('❌ Database initialization failed:', error)
        return false
    }
}
