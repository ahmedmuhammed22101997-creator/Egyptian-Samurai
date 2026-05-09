'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Mail, MessageCircle, Share2, Link2 } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-[#2C2C2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={36} />
              <span className="font-bold text-lg">{t('brand')}</span>
            </div>
            <p className="text-gray-400 text-sm">
              日本人旅行者のためのエジプト専門ガイドサービス
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-[#D4AF37] mb-4">{t('nav.home')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/guides" className="hover:text-[#D4AF37] transition-colors">{t('nav.guides')}</Link></li>
              <li><Link href="/airport-pickup" className="hover:text-[#D4AF37] transition-colors">{t('nav.airportPickup')}</Link></li>
              <li><Link href="/explore" className="hover:text-[#D4AF37] transition-colors">{t('nav.explore')}</Link></li>
              <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#D4AF37] mb-4">{t('home.contact.title')}</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="mailto:contact@example.com" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                <Mail className="w-4 h-4" />
                contact@example.com
              </a>
              <a href="https://wa.me/20XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                <Share2 className="w-4 h-4" />
                Instagram
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                <Link2 className="w-4 h-4" />
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
