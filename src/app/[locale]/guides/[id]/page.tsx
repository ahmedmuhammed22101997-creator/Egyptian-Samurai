import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GuideDetailClient from './GuideDetailClient'

export default async function GuideDetailPage({ params }: { params: { id: string } }) {
  let guide = null
  let packages = []

  try {
    const supabase = createServerClient()
    const [guideRes, pkgRes] = await Promise.all([
      supabase.from('guides').select('*').eq('id', params.id).single(),
      supabase.from('packages').select('*').eq('guide_id', params.id).eq('is_active', true),
    ])
    guide = guideRes.data
    packages = pkgRes.data || []
  } catch {}

  if (!guide) notFound()

  return <GuideDetailClient guide={guide} packages={packages} />
}
