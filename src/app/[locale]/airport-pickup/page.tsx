import { createServerClient } from '@/lib/supabase/server'
import AirportPickupClient from './AirportPickupClient'

export default async function AirportPickupPage() {
  let services = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('airport_pickup_services').select('*').eq('is_active', true)
    services = data || []
  } catch {}

  return <AirportPickupClient services={services} />
}
