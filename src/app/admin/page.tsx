export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  let stats = { guides: 0, packages: 0, pickups: 0, landmarks: 0, reviews: 0 }
  try {
    const supabase = createServerClient()
    const [g, p, pk, l, r] = await Promise.all([
      supabase.from('guides').select('id', { count: 'exact', head: true }),
      supabase.from('packages').select('id', { count: 'exact', head: true }),
      supabase.from('airport_pickup_services').select('id', { count: 'exact', head: true }),
      supabase.from('landmarks').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
    ])
    stats = {
      guides: g.count || 0,
      packages: p.count || 0,
      pickups: pk.count || 0,
      landmarks: l.count || 0,
      reviews: r.count || 0,
    }
  } catch {}
  return <AdminDashboard stats={stats} />
}
