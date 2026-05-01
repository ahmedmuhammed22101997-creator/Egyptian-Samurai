import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'エジプシャン サムライ | Egyptian SAMURAI',
  description: '日本人旅行者のためのエジプト専門ガイドサービス',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
