import { createServerClient } from '@/lib/supabase/server'
import ContactClient from './ContactClient'

export default async function ContactPage() {
  let contact = null
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('contact_info').select('*').single()
    contact = data
  } catch {}
  return <ContactClient contact={contact} />
}
