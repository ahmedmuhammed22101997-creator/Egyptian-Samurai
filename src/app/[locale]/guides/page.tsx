import { createServerClient } from '@/lib/supabase/server'
import GuidesClient from './GuidesClient'

export default async function GuidesPage() {
  let guides = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('guides').select('*').eq('is_active', true).order('created_at')
    guides = data || []
  } catch {}

  return <GuidesClient guides={guides} />
}
