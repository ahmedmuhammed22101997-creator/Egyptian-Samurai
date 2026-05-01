export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import PackagesAdminClient from './PackagesAdminClient'

export default async function AdminPackagesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let packages: any[] = []
  let guides: { id: string; name: string }[] = []
  try {
    const supabase = createServerClient()
    const [pkgRes, guidesRes] = await Promise.all([
      supabase.from('packages').select('*, guide:guides(name)').order('created_at', { ascending: false }),
      supabase.from('guides').select('id, name').eq('is_active', true),
    ])
    packages = pkgRes.data || []
    guides = (guidesRes.data || []) as { id: string; name: string }[]
  } catch {}
  return <PackagesAdminClient initialPackages={packages} guides={guides} />
}
