'use client'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, Package, Car, Map, Star } from 'lucide-react'

interface Stats {
  guides: number
  packages: number
  pickups: number
  landmarks: number
  reviews: number
}

const statCards = [
  { key: 'guides', label: 'ガイド', icon: Users, color: 'bg-[#1E5F8E]', href: '/admin/guides' },
  { key: 'packages', label: 'パッケージ', icon: Package, color: 'bg-[#D4AF37]', href: '/admin/packages' },
  { key: 'pickups', label: '空港送迎', icon: Car, color: 'bg-[#C84B31]', href: '/admin/airport-pickup' },
  { key: 'landmarks', label: 'ランドマーク', icon: Map, color: 'bg-[#2C2C2C]', href: '/admin/landmarks' },
  { key: 'reviews', label: 'レビュー', icon: Star, color: 'bg-purple-600', href: '/admin/reviews' },
]

export default function AdminDashboard({ stats }: { stats: Stats }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C2C2C]">ダッシュボード</h1>
          <p className="text-gray-500 text-sm mt-1">サイト概要</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.key} href={card.href} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-[#2C2C2C]">{stats[card.key as keyof Stats]}</p>
                <p className="text-gray-500 text-sm mt-1">{card.label}</p>
              </Link>
            )
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-[#2C2C2C] mb-4">クイックリンク</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {statCards.map((card) => (
              <Link key={card.key} href={`${card.href}/new`}
                className="text-sm text-[#1E5F8E] hover:underline p-2 rounded hover:bg-gray-50">
                + {card.label}を追加
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
