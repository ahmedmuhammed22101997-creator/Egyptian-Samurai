export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import AboutAdminClient from './AboutAdminClient'

export default async function AdminAboutPage() {
  let about = null
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('about_content').select('*').single()
    about = data
  } catch {}
  return <AboutAdminClient initialAbout={about} />
}
