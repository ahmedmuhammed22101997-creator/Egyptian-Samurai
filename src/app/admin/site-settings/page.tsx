'use client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SiteSettingsPage() {
  return (
    <AdminPageShell title="サイト設定" description="一般的なサイト設定">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">サイトプレビュー</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#1E5F8E] hover:underline">
                <Globe className="w-4 h-4" />
                サイトを開く（日本語）
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link href="/en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#1E5F8E] hover:underline">
                <Globe className="w-4 h-4" />
                サイトを開く（英語）
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">クイックリンク</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['ヒーロー画像', '/admin/hero-images'],
                ['ガイド管理', '/admin/guides'],
                ['パッケージ', '/admin/packages'],
                ['空港送迎', '/admin/airport-pickup'],
                ['ランドマーク', '/admin/landmarks'],
                ['レビュー', '/admin/reviews'],
                ['私たちについて', '/admin/about'],
                ['連絡先', '/admin/contact-info'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-[#1E5F8E] hover:underline">{label}</Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  )
}
