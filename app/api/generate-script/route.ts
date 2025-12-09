import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
    try {
        if (!process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json(
                { error: 'Google AI API key is not configured. Please set GOOGLE_AI_API_KEY environment variable.' },
                { status: 500 }
            )
        }

        const formData = await request.formData()
        const environment = formData.get('environment') as string
        const userPrompt = formData.get('userPrompt') as string
        const fileCount = parseInt(formData.get('fileCount') as string || '0')

        if (!userPrompt || userPrompt.trim().length === 0) {
            return NextResponse.json(
                { error: 'User prompt is required' },
                { status: 400 }
            )
        }

        // Read uploaded files and their notes
        const dependencies: Array<{ filename: string; content: string; notes: string }> = []

        for (let i = 0; i < fileCount; i++) {
            const file = formData.get(`file_${i}`) as File
            const notes = formData.get(`notes_${i}`) as string || ''

            if (file) {
                const content = await file.text()
                dependencies.push({
                    filename: file.name,
                    content,
                    notes
                })
            }
        }

        // Build context from dependencies
        let dependencyContext = ''
        if (dependencies.length > 0) {
            dependencyContext = '\n\n## Reference Files:\n\n'
            dependencies.forEach((dep, index) => {
                dependencyContext += `### File ${index + 1}: ${dep.filename}\n`
                if (dep.notes) {
                    dependencyContext += `**Developer Notes:** ${dep.notes}\n\n`
                }
                dependencyContext += `\`\`\`lua\n${dep.content}\n\`\`\`\n\n`
            })
        }

        // Environment-specific system prompts
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

        const systemPrompt = systemPrompts[environment as keyof typeof systemPrompts] || systemPrompts.studio

        // Build the full prompt
        const fullPrompt = `${systemPrompt}

## User Request:
${userPrompt}
${dependencyContext}

Please generate a complete, well-documented Roblox Lua script that fulfills the user's request. Use the reference files as guidance if provided. Include comments explaining the code logic.

IMPORTANT: Return ONLY the Lua code with comments. Do not include any markdown formatting, explanations outside the code, or code block markers. Just pure Lua code that can be directly copied and used.`

        // Generate script using Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        let generatedScript = response.text()

        // Clean up any markdown code blocks if they appear
        generatedScript = generatedScript.replace(/```lua\n?/g, '').replace(/```\n?/g, '').trim()

        return NextResponse.json({ script: generatedScript })

    } catch (error: any) {
        console.error('Error generating script:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate script. Please try again.' },
            { status: 500 }
        )
    }
}
