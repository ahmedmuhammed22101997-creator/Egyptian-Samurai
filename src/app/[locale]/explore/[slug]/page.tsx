import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import LandmarkDetailClient from './LandmarkDetailClient'

export default async function LandmarkDetailPage({ params }: { params: { slug: string } }) {
  let landmark = null
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('landmarks').select('*').eq('slug', params.slug).single()
    landmark = data
  } catch {}
  if (!landmark) notFound()
  return <LandmarkDetailClient landmark={landmark} />
}
