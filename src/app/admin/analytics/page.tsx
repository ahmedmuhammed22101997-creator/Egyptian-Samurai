export const dynamic = 'force-dynamic'
import { createAdminClient } from '@/lib/supabase/admin'
import AnalyticsDashboard from './AnalyticsDashboard'

type Row = { count: number; key: string }

function classifyReferrer(ref: string | null): string {
  if (!ref) return 'Direct / Unknown'
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '').toLowerCase()
    if (host.includes('google')) return 'Google'
    if (host.includes('bing')) return 'Bing'
    if (host.includes('duckduckgo')) return 'DuckDuckGo'
    if (host.includes('yahoo')) return 'Yahoo'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('facebook') || host === 'fb.com' || host === 'm.facebook.com') return 'Facebook'
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X'
    if (host.includes('tiktok')) return 'TikTok'
    if (host.includes('linkedin')) return 'LinkedIn'
    if (host.includes('youtube')) return 'YouTube'
    if (host.includes('reddit')) return 'Reddit'
    if (host.includes('t.co')) return 'Twitter/X'
    if (host.includes('pinterest')) return 'Pinterest'
    if (host.includes('whatsapp') || host === 'wa.me') return 'WhatsApp'
    if (host.includes('line.me')) return 'LINE'
    return host
  } catch {
    return 'Unknown'
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  JP: '🇯🇵 Japan', EG: '🇪🇬 Egypt', US: '🇺🇸 USA', GB: '🇬🇧 UK',
  KR: '🇰🇷 Korea', CN: '🇨🇳 China', DE: '🇩🇪 Germany', FR: '🇫🇷 France',
  IT: '🇮🇹 Italy', ES: '🇪🇸 Spain', SA: '🇸🇦 Saudi Arabia', AE: '🇦🇪 UAE',
  TW: '🇹🇼 Taiwan', AU: '🇦🇺 Australia', CA: '🇨🇦 Canada', BR: '🇧🇷 Brazil',
  IN: '🇮🇳 India', ID: '🇮🇩 Indonesia', MY: '🇲🇾 Malaysia', SG: '🇸🇬 Singapore',
  PH: '🇵🇭 Philippines', TH: '🇹🇭 Thailand', VN: '🇻🇳 Vietnam', RU: '🇷🇺 Russia',
  TR: '🇹🇷 Turkey',
}

function countryLabel(code: string | null): string {
  if (!code) return '🌐 Unknown'
  return COUNTRY_NAMES[code] || code
}

export default async function AnalyticsPage() {
  const supabase = createAdminClient()

  const now = Date.now()
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    totalRes, dayRes, weekRes, monthRes, recentRes, usersRes,
  ] = await Promise.all([
    supabase.from('page_views').select('id', { count: 'exact', head: true }),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', dayAgo),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', monthAgo),
    supabase.from('page_views').select('path, referrer, country, city, locale, created_at').order('created_at', { ascending: false }).limit(50),
    supabase.auth.admin.listUsers({ page: 1, perPage: 100 }),
  ])

  // For aggregations we need the raw rows of the last 30 days
  const { data: rows } = await supabase
    .from('page_views')
    .select('path, referrer, country')
    .gte('created_at', monthAgo)
    .limit(10000)

  const tally = (key: 'path' | 'country' | 'referrer') => {
    const map = new Map<string, number>()
    for (const r of rows || []) {
      let k = (r as Record<string, string | null>)[key]
      if (key === 'referrer') k = classifyReferrer(k as string | null)
      if (key === 'country') k = countryLabel(k as string | null)
      const finalKey = k || 'Unknown'
      map.set(finalKey, (map.get(finalKey) || 0) + 1)
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map<Row>(([key, count]) => ({ key, count }))
  }

  const topPaths = tally('path')
  const topCountries = tally('country')
  const topReferrers = tally('referrer')

  const adminUsers = (usersRes.data?.users || [])
    .map((u) => ({
      email: u.email || '(no email)',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }))
    .sort((a, b) =>
      (new Date(b.last_sign_in_at || 0).getTime()) - (new Date(a.last_sign_in_at || 0).getTime())
    )

  return (
    <AnalyticsDashboard
      totals={{
        all: totalRes.count || 0,
        day: dayRes.count || 0,
        week: weekRes.count || 0,
        month: monthRes.count || 0,
      }}
      topPaths={topPaths}
      topCountries={topCountries}
      topReferrers={topReferrers}
      recent={(recentRes.data || []).map((r) => ({
        path: r.path,
        referrer: classifyReferrer(r.referrer),
        country: countryLabel(r.country),
        city: r.city,
        locale: r.locale,
        created_at: r.created_at,
      }))}
      adminUsers={adminUsers}
    />
  )
}
