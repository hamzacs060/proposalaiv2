import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProposalAI — Win More Freelance Clients',
  description: 'AI-powered proposal generator. Paste a job, get a winning proposal in 30 seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
