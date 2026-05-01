export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import GuidesAdminClient from './GuidesAdminClient'

export default async function AdminGuidesPage() {
  let guides = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('guides').select('*').order('created_at', { ascending: false })
    guides = data || []
  } catch {}
  return <GuidesAdminClient initialGuides={guides} />
}
