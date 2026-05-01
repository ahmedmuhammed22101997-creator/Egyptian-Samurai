import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PickupDetailClient from './PickupDetailClient'

export default async function PickupDetailPage({ params }: { params: { id: string } }) {
  let service = null
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('airport_pickup_services').select('*').eq('id', params.id).single()
    service = data
  } catch {}

  if (!service) notFound()
  return <PickupDetailClient service={service} />
}
