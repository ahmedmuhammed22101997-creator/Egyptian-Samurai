export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import LandmarksAdminClient from './LandmarksAdminClient'

export default async function AdminLandmarksPage() {
  let landmarks = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('landmarks').select('*').order('name_ja')
    landmarks = data || []
  } catch {}
  return <LandmarksAdminClient initialLandmarks={landmarks} />
}
