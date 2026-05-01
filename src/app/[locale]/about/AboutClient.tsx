'use client'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import type { AboutContent } from '@/types/database'

export default function AboutClient({ about }: { about: AboutContent | null }) {
  const t = useTranslations('about')
  const locale = useLocale()
  const title = about ? (locale === 'ja' ? about.title_ja : about.title_en) : t('title')
  const content = about ? (locale === 'ja' ? about.content_ja : about.content_en) : ''

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="bg-gradient-to-br from-[#1E5F8E] to-[#0E4F7E] py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {about?.photo_url ? (
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <Image src={about.photo_url} alt={title} fill className="object-cover" />
            </div>
          ) : (
            <div className="h-80 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#1E5F8E] flex items-center justify-center shadow-xl">
              <span className="text-white text-8xl">🏛️</span>
            </div>
          )}
          <div>
            <div className="w-12 h-1 bg-[#D4AF37] mb-6" />
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">{title}</h2>
            {content ? (
              <p className="text-gray-600 leading-relaxed text-lg">{content}</p>
            ) : (
              <p className="text-gray-400 italic">管理パネルからコンテンツを追加してください。</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
