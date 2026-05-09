import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { path?: string; locale?: string }
    const path = (body.path || '/').slice(0, 500)
    const locale = (body.locale || '').slice(0, 8) || null

    // Skip admin routes — admins shouldn't pollute their own analytics
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ skipped: true })
    }

    const headers = req.headers
    const referrer = headers.get('referer') || null
    const userAgent = headers.get('user-agent')?.slice(0, 500) || null
    // Vercel geo headers (only populated on Vercel runtime)
    const country = headers.get('x-vercel-ip-country') || null
    const city = headers.get('x-vercel-ip-city')
      ? decodeURIComponent(headers.get('x-vercel-ip-city')!)
      : null

    // Skip self-referrals from the same site
    let cleanReferrer: string | null = referrer
    if (referrer) {
      try {
        const refUrl = new URL(referrer)
        const ownHost = headers.get('host')
        if (ownHost && refUrl.host === ownHost) cleanReferrer = null
      } catch {}
    }

    const supabase = createAdminClient()
    await supabase.from('page_views').insert({
      path,
      referrer: cleanReferrer,
      country,
      city,
      user_agent: userAgent,
      locale,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
