import { createServerClient } from '@/lib/supabase/server'
import AboutClient from './AboutClient'

export default async function AboutPage() {
  let about = null
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('about_content').select('*').single()
    about = data
  } catch {}
  return <AboutClient about={about} />
}
