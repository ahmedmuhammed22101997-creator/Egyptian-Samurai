'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Globe, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Guide } from '@/types/database'

interface GuidesClientProps {
  guides: Guide[]
}

export default function GuidesClient({ guides }: GuidesClientProps) {
  const t = useTranslations('guides')
  const locale = useLocale()
  const [filter, setFilter] = useState<'all' | 'licensed' | 'travel_buddy'>('all')

  const filtered = guides.filter((g) => filter === 'all' || g.type === filter)

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E5F8E] to-[#0E4F7E] py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">{t('subtitle')}</p>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {(['all', 'licensed', 'travel_buddy'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === type
                  ? 'bg-[#D4AF37] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D4AF37]'
              }`}
            >
              {type === 'all' ? t('filter.all') : type === 'licensed' ? t('filter.licensed') : t('filter.travelBuddy')}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">ガイドはまだ登録されていません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((guide, i) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative h-56">
                  {guide.photo_url ? (
                    <Image src={guide.photo_url} alt={guide.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#E8D5B7] to-[#D4AF37] flex items-center justify-center">
                      <span className="text-5xl text-white">👤</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant={guide.type === 'licensed' ? 'secondary' : 'sand'}>
                      {guide.type === 'licensed' ? t('licensed') : t('travelBuddy')}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#2C2C2C]">{guide.name}</h3>
                    {guide.type === 'licensed' && (
                      <Award className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {locale === 'ja' ? guide.bio_ja : guide.bio_en}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs text-gray-500">
                      {t('experience')}: <strong>{guide.experience_years}{t('years')}</strong>
                    </span>
                    {guide.languages?.slice(0, 3).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/guides/${guide.id}`}>{t('viewProfile')}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
