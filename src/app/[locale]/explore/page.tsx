import { createServerClient } from '@/lib/supabase/server'
import ExploreClient from './ExploreClient'

export default async function ExplorePage() {
  let landmarks = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('landmarks').select('*').order('is_featured', { ascending: false })
    landmarks = data || []
  } catch {}
  return <ExploreClient landmarks={landmarks} />
}
