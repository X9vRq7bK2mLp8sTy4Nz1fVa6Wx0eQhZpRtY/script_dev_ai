import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// POST - Auto-commit and push changes
export async function POST(request: NextRequest) {
    try {
        const user = requireAuth(request)
        const { filename, code, message } = await request.json()

        if (!filename || !code) {
            return NextResponse.json(
                { error: 'Filename and code are required' },
                { status: 400 }
            )
        }

        // Check if auto-commit is enabled
        if (process.env.GIT_AUTO_COMMIT !== 'true') {
            return NextResponse.json(
                { error: 'Auto-commit is not enabled. Set GIT_AUTO_COMMIT=true in environment variables.' },
                { status: 403 }
            )
        }

        // Write code to file (you'd specify the actual file path based on your project structure)
        const fs = await import('fs/promises')
        await fs.writeFile(filename, code, 'utf-8')

        // Git operations
        const commitMessage = message || `AI: Updated ${filename}`

        await execAsync(`git add "${filename}"`)
        const { stdout: commitOutput } = await execAsync(`git commit -m "${commitMessage}"`)

        // Push if GitHub token is available
        if (process.env.GITHUB_TOKEN) {
            await execAsync('git push origin main')
        }

        // Extract commit SHA from output
        const shaMatch = commitOutput.match(/\[main ([a-f0-9]+)\]/)
        const commitSha = shaMatch ? shaMatch[1] : 'unknown'

        return NextResponse.json({
            success: true,
            commit: commitSha,
            message: commitMessage,
            pushed: !!process.env.GITHUB_TOKEN
        })

    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.error('Auto-commit error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to commit changes' },
            { status: 500 }
        )
    }
}
