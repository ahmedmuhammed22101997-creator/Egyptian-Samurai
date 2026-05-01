export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import HeroImagesClient from './HeroImagesClient'

export default async function HeroImagesPage() {
  let images = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('hero_images').select('*').order('display_order')
    images = data || []
  } catch {}
  return <HeroImagesClient initialImages={images} />
}
