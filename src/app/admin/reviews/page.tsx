export const dynamic = 'force-dynamic'
import { createServerClient } from '@/lib/supabase/server'
import ReviewsAdminClient from './ReviewsAdminClient'

export default async function AdminReviewsPage() {
  let reviews = []
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    reviews = data || []
  } catch {}
  return <ReviewsAdminClient initialReviews={reviews} />
}
