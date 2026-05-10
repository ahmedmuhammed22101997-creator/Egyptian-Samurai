'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const SESSION_KEY = 'samurai-splash-shown'

export default function SplashScreen() {
  const [show, setShow] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Show splash only once per session — no flash on every navigation
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setShow(false)
      return
    }

    // Fade out after a short pause so the logo is actually visible
    const fadeStart = setTimeout(() => setFading(true), 1100)
    const hide = setTimeout(() => {
      setShow(false)
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch {}
    }, 1700)

    return () => { clearTimeout(fadeStart); clearTimeout(hide) }
  }, [])

  if (!show) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFBF7] transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative w-96 h-48 sm:w-[500px] sm:h-60 animate-pulse-slow">
        <Image src="/logo.png" alt="Egyptian SAMURAI" fill sizes="500px" className="object-contain" priority />
      </div>
      <div className="mt-8 w-40 h-1 bg-[#E8D5B7] rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-[#D4AF37] rounded-full animate-loader-slide" />
      </div>
    </div>
  )
}
