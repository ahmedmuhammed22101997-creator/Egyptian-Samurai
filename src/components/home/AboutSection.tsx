'use client'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import type { AboutContent } from '@/types/database'

interface AboutSectionProps {
  about: AboutContent | null
}

export default function AboutSection({ about }: AboutSectionProps) {
  const t = useTranslations('home.about')
  const locale = useLocale()

  const title = about ? (locale === 'ja' ? about.title_ja : about.title_en) : t('title')
  const content = about ? (locale === 'ja' ? about.content_ja : about.content_en) : ''
  const photo = about?.photo_url

  return (
    <section className="py-20 px-4 bg-[#E8D5B7]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {photo ? (
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image src={photo} alt={title} fill className="object-cover" />
              </div>
            ) : (
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#D4AF37] to-[#1E5F8E] flex items-center justify-center">
                <span className="text-white text-6xl">🏛️</span>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-1 bg-[#D4AF37] mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-6">{title}</h2>
            {content ? (
              <p className="text-gray-600 leading-relaxed text-lg">{content}</p>
            ) : (
              <p className="text-gray-400 italic">管理パネルからコンテンツを追加してください。</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
