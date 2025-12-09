import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { ConversationModel } from '@/lib/models/Conversation'
import { MessageModel, FileAttachment } from '@/lib/models/Message'
import { ErrorFeedbackModel } from '@/lib/models/ErrorFeedback'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

// POST - Send message and get AI response
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = requireAuth(request)
        const { id: conversationId } = params

        // Verify conversation exists and user owns it
        const conversation = await ConversationModel.findById(conversationId)

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            )
        }

        if (conversation.userId.toString() !== user.userId) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const formData = await request.formData()
        const userMessage = formData.get('message') as string
        const errorFeedback = formData.get('errors') as string | null
        const fileCount = parseInt(formData.get('fileCount') as string || '0')

        if (!userMessage || userMessage.trim().length === 0) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Parse uploaded files
        const files: FileAttachment[] = []
        for (let i = 0; i < fileCount; i++) {
            const file = formData.get(`file_${i}`) as File
            const notes = formData.get(`notes_${i}`) as string || ''

            if (file) {
                const content = await file.text()
                files.push({
                    filename: file.name,
                    content,
                    notes
                })
            }
        }

        // Save user message
        const userMessageDoc = await MessageModel.create(
            conversationId,
            'user',
            userMessage,
            {
                files: files.length > 0 ? files : undefined,
                errors: errorFeedback || undefined
            }
        )

        // Build AI context from conversation history
        const allMessages = await MessageModel.findByConversationId(conversationId)
        const errorHistory = await ErrorFeedbackModel.findByConversationId(conversationId)

        // Build context string
        let contextMessages = allMessages
            .filter(m => m.role !== 'system')
            .map(m => {
                let text = `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
                if (m.metadata?.errors) {
                    text += `\n[Error encountered: ${m.metadata.errors}]`
                }
                return text
            })
            .join('\n\n')

        // Environment-specific prompts
        const systemPrompts = {
            executor: `You are an expert Roblox Lua script developer specializing in executor environments for testing and research purposes.

Your scripts should:
- Be compatible with common executor environments (Synapse, KRNL, Fluxus, etc.)
- Include proper error handling and safety checks
- Use modern Luau syntax and best practices
- Be optimized for performance and minimal detection
- Include clear comments explaining the logic
- Handle edge cases and potential failures gracefully
- Use appropriate game service references (game:GetService())
- Implement proper cleanup and memory management

Focus on:
- Testing methodologies and debugging
- Environment compatibility checks
- Security research best practices
- Anti-cheat awareness (for research purposes)
- Proper hook implementations when needed
- Clean, maintainable code structure`,

            studio: `You are an expert Roblox Lua script developer specializing in Roblox Studio development.

Your scripts should:
- Follow Roblox Studio best practices and conventions
- Be production-ready and optimized for live games
- Use proper Roblox API methods and services
- Include comprehensive error handling
- Be well-documented with clear comments
- Follow the Roblox Community Rules and TOS
- Implement proper client-server architecture when applicable
- Use RemoteEvents/RemoteFunctions appropriately for server communication
- Be optimized for performance and scalability

Focus on:
- Game development best practices
- Player experience and UX
- Network optimization (when applicable)
- Security against exploits
- Clean, maintainable code structure
- Proper event handling and cleanup`
        }

        const systemPrompt = systemPrompts[conversation.environment]

        // Add error learning context
        let errorContext = ''
        if (errorHistory.length > 0) {
            errorContext = '\n\n## Previous Errors and Learnings:\n'
            errorContext += errorHistory.slice(0, 5).map((e, i) =>
                `${i + 1}. Error: ${e.errorText}\n   Context: ${e.context}`
            ).join('\n')
            errorContext += '\n\nLearn from these previous errors and avoid making the same mistakes.'
        }

        // Add file context
        let fileContext = ''
        if (files.length > 0) {
            fileContext = '\n\n## Reference Files:\n\n'
            files.forEach((file, index) => {
                fileContext += `### File ${index + 1}: ${file.filename}\n`
                if (file.notes) {
                    fileContext += `**Notes:** ${file.notes}\n\n`
                }
                fileContext += `\`\`\`lua\n${file.content}\n\`\`\`\n\n`
            })
        }

        const fullPrompt = `${systemPrompt}

## Conversation History:
${contextMessages}
${errorContext}
${fileContext}

## Current Request:
${userMessage}

Please provide a helpful response. If generating code, include ONLY the Lua code with comments. No markdown formatting or explanations outside the code.`

        // Try models with fallback
        const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash']
        let aiResponse = ''
        let lastError: Error | null = null

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName })
                const result = await model.generateContent(fullPrompt)
                const response = await result.response
                aiResponse = response.text()

                // Clean up markdown if present
                aiResponse = aiResponse.replace(/```lua\n?/g, '').replace(/```\n?/g, '').trim()
                break
            } catch (error: any) {
                console.error(`Model ${modelName} failed:`, error.message)
                lastError = error
            }
        }

        if (!aiResponse && lastError) {
            throw lastError
        }

        // Save AI response
        const aiMessageDoc = await MessageModel.create(
            conversationId,
            'assistant',
            aiResponse,
            {
                generatedCode: aiResponse.includes('--') || aiResponse.includes('local') ? aiResponse : undefined
            }
        )

        // Update conversation metadata
        await ConversationModel.updateMetadata(conversationId, new Date())

        // If error feedback provided, save it
        if (errorFeedback) {
            await ErrorFeedbackModel.create(
                conversationId,
                userMessageDoc._id!.toString(),
                errorFeedback,
                userMessage
            )
        }

        return NextResponse.json({
            message: aiMessageDoc,
            conversation: await ConversationModel.findById(conversationId)
        })

    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.error('Send message error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        )
    }
}
