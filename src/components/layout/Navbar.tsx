'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const tBrand = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLocale = () => {
    const newLocale = locale === 'ja' ? 'en' : 'ja'
    // Strip any current locale prefix
    const bare = pathname.replace(/^\/(ja|en)(?=\/|$)/, '') || '/'
    // Japanese is the default locale (no prefix); English is prefixed with /en
    const target = newLocale === 'ja' ? bare : `/en${bare === '/' ? '' : bare}`
    router.push(target)
  }

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/guides', label: t('guides') },
    { href: '/airport-pickup', label: t('airportPickup') },
    { href: '/explore', label: t('explore') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className={`font-bold text-lg ${scrolled ? 'text-[#2C2C2C]' : 'text-white'}`}>
              {tBrand('brand')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] ${
                  scrolled ? 'text-[#2C2C2C]' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleLocale}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#D4AF37] ${scrolled ? 'text-[#2C2C2C]' : 'text-white'}`}
            >
              <Globe className="w-4 h-4" />
              {locale === 'ja' ? 'EN' : '日本語'}
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLocale}
              aria-label={locale === 'ja' ? 'Switch to English' : '日本語に切り替え'}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold border transition-colors ${
                scrolled
                  ? 'text-[#2C2C2C] border-[#2C2C2C]/20 hover:bg-[#F5EDD8]'
                  : 'text-white border-white/40 hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              {locale === 'ja' ? 'EN' : '日本語'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 ${scrolled ? 'text-[#2C2C2C]' : 'text-white'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:text-[#D4AF37] hover:bg-[#F5EDD8] rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
