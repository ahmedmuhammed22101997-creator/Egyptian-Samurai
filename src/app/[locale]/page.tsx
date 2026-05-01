import { createServerClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/home/HeroSlider'
import CategoryCards from '@/components/home/CategoryCards'
import AboutSection from '@/components/home/AboutSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import ContactSection from '@/components/home/ContactSection'

export default async function HomePage() {
  let heroImages = []
  let reviews = []
  let about = null
  let contact = null

  try {
    const supabase = createServerClient()
    const [heroRes, reviewsRes, aboutRes, contactRes] = await Promise.all([
      supabase.from('hero_images').select('*').eq('is_active', true).order('display_order'),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('about_content').select('*').single(),
      supabase.from('contact_info').select('*').single(),
    ])
    heroImages = heroRes.data || []
    reviews = reviewsRes.data || []
    about = aboutRes.data
    contact = contactRes.data
  } catch {
    // Supabase not configured yet - show placeholders
  }

  return (
    <>
      <HeroSlider images={heroImages} />
      <CategoryCards />
      <AboutSection about={about} />
      {reviews.length > 0 && <ReviewsSection reviews={reviews} />}
      <ContactSection contact={contact} />
    </>
  )
}
