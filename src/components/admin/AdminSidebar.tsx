'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Image, Users, Package, Car, Map, Star, Info, Phone, Settings, LogOut, BarChart3
} from 'lucide-react'
import Logo from '@/components/Logo'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'ダッシュボード' },
  { href: '/admin/analytics', icon: BarChart3, label: 'アナリティクス' },
  { href: '/admin/hero-images', icon: Image, label: 'ヒーロー画像' },
  { href: '/admin/guides', icon: Users, label: 'ガイド' },
  { href: '/admin/packages', icon: Package, label: 'パッケージ' },
  { href: '/admin/airport-pickup', icon: Car, label: '空港送迎' },
  { href: '/admin/landmarks', icon: Map, label: 'ランドマーク' },
  { href: '/admin/reviews', icon: Star, label: 'レビュー' },
  { href: '/admin/about', icon: Info, label: '私たちについて' },
  { href: '/admin/contact-info', icon: Phone, label: '連絡先情報' },
  { href: '/admin/site-settings', icon: Settings, label: 'サイト設定' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-[#2C2C2C] min-h-screen flex flex-col fixed left-0 top-0 bottom-0">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <p className="text-white font-bold text-sm">Egyptian SAMURAI</p>
            <p className="text-gray-400 text-xs">管理パネル</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#D4AF37] text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>
    </aside>
  )
}
