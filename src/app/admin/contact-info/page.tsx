export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import ContactInfoAdminClient from './ContactInfoAdminClient'

export default async function AdminContactInfoPage() {
  let contact = null
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('contact_info').select('*').single()
    contact = data
  } catch {}
  return <ContactInfoAdminClient initialContact={contact} />
}
