import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: '管理パネル | Egyptian SAMURAI Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
