import type { Metadata } from 'next'
import './globals.css'
import { AccessibilityProvider } from '@/components/providers/AccessibilityProvider'
import { SkipLink } from '@/components/accessibility/SkipLink'

export const metadata: Metadata = {
  title: 'EduAssist - Campus Accessibility Hub',
  description: 'A web application designed to make campus life more accessible to visually and hearing-impaired students',
  keywords: ['accessibility', 'education', 'text-to-speech', 'speech-to-text', 'captions'],
  authors: [{ name: 'EduAssist Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  )
}