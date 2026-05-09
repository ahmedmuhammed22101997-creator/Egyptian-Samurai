'use client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Eye, Globe, Link2, FileText, Users } from 'lucide-react'

type Totals = { all: number; day: number; week: number; month: number }
type Row = { count: number; key: string }
type RecentView = {
  path: string
  referrer: string
  country: string
  city: string | null
  locale: string | null
  created_at: string
}
type AdminUser = {
  email: string
  created_at: string
  last_sign_in_at: string | null | undefined
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '—'
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}秒前`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}分前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}時間前`
  const days = Math.floor(hr / 24)
  if (days < 30) return `${days}日前`
  const months = Math.floor(days / 30)
  return `${months}ヶ月前`
}

function BarRow({ row, max }: { row: Row; max: number }) {
  const pct = max > 0 ? Math.round((row.count / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[#2C2C2C] truncate pr-2" title={row.key}>{row.key}</span>
        <span className="text-gray-500 tabular-nums">{row.count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#2C2C2C] tabular-nums">{value.toLocaleString()}</p>
    </div>
  )
}

function Section({ title, icon: Icon, rows, empty }: {
  title: string; icon: React.ComponentType<{ className?: string }>; rows: Row[]; empty: string
}) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0)
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#D4AF37]" />
        <h2 className="text-lg font-bold text-[#2C2C2C]">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-gray-400 text-sm py-6 text-center">{empty}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => <BarRow key={`${r.key}-${i}`} row={r} max={max} />)}
        </div>
      )}
    </div>
  )
}

export default function AnalyticsDashboard({
  totals, topPaths, topCountries, topReferrers, recent, adminUsers,
}: {
  totals: Totals
  topPaths: Row[]
  topCountries: Row[]
  topReferrers: Row[]
  recent: RecentView[]
  adminUsers: AdminUser[]
}) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C2C2C]">アナリティクス</h1>
          <p className="text-gray-500 text-sm mt-1">サイトの訪問者・参照元・地域の統計</p>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="今日" value={totals.day} icon={Eye} color="bg-[#D4AF37]" />
          <StatCard label="今週 (7日)" value={totals.week} icon={Eye} color="bg-[#1E5F8E]" />
          <StatCard label="今月 (30日)" value={totals.month} icon={Eye} color="bg-[#C84B31]" />
          <StatCard label="累計" value={totals.all} icon={Eye} color="bg-[#2C2C2C]" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Section title="国別 (TOP 10 / 30日)" icon={Globe} rows={topCountries} empty="まだデータがありません" />
          <Section title="流入元 (TOP 10 / 30日)" icon={Link2} rows={topReferrers} empty="まだデータがありません" />
          <Section title="人気ページ (TOP 10 / 30日)" icon={FileText} rows={topPaths} empty="まだデータがありません" />
        </div>

        {/* Admin users */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-lg font-bold text-[#2C2C2C]">管理者ログイン履歴</h2>
          </div>
          {adminUsers.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">管理者がいません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4 font-medium">メール</th>
                    <th className="py-2 pr-4 font-medium">最終ログイン</th>
                    <th className="py-2 pr-4 font-medium">作成日</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {adminUsers.map((u) => (
                    <tr key={u.email}>
                      <td className="py-3 pr-4 font-medium">{u.email}</td>
                      <td className="py-3 pr-4 text-gray-600">
                        {u.last_sign_in_at
                          ? <>
                              <span>{timeAgo(u.last_sign_in_at)}</span>
                              <span className="text-gray-400 ml-2 text-xs">({new Date(u.last_sign_in_at).toLocaleString('ja-JP')})</span>
                            </>
                          : <span className="text-gray-400">未ログイン</span>}
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{new Date(u.created_at).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent visits */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-lg font-bold text-[#2C2C2C]">最近の訪問 (50件)</h2>
          </div>
          {recent.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">まだ訪問がありません。本番サイトでこのページを使い始めると記録されます。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4 font-medium">時間</th>
                    <th className="py-2 pr-4 font-medium">ページ</th>
                    <th className="py-2 pr-4 font-medium">国 / 都市</th>
                    <th className="py-2 pr-4 font-medium">流入元</th>
                    <th className="py-2 pr-4 font-medium">言語</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recent.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">{timeAgo(r.created_at)}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs">{r.path}</td>
                      <td className="py-2.5 pr-4">{r.country}{r.city ? ` · ${r.city}` : ''}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{r.referrer}</td>
                      <td className="py-2.5 pr-4 text-gray-500">{r.locale || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
