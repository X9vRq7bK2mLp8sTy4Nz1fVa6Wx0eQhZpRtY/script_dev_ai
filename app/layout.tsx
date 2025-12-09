import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Roblox Script Dev AI - Professional Script Development',
    description: 'AI-powered Roblox script development and refinement platform. Develop scripts for Executor environments or Roblox Studio with intelligent assistance.',
    keywords: ['Roblox', 'Script Development', 'AI', 'Lua', 'Executor', 'Studio'],
    authors: [{ name: 'Script Dev AI' }],
    themeColor: '#0a0a0f',
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body>{children}</body>
        </html>
    )
}
