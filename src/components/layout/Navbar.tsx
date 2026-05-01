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
    // Strip current locale prefix if present
    const pathWithoutLocale = pathname.replace(/^\/(ja|en)/, '') || '/'
    router.push(`/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`)
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
              className={`p-2 ${scrolled ? 'text-[#2C2C2C]' : 'text-white'}`}
            >
              <Globe className="w-5 h-5" />
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
