export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import PickupAdminClient from './PickupAdminClient'

export default async function AdminPickupPage() {
  let services = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('airport_pickup_services').select('*')
    services = data || []
  } catch {}
  return <PickupAdminClient initialServices={services} />
}
