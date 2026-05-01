'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Landmark } from '@/types/database'

export default function ExploreClient({ landmarks }: { landmarks: Landmark[] }) {
  const t = useTranslations('explore')
  const locale = useLocale()

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8960C] py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-white/90">{t('subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {landmarks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">ランドマークはまだ登録されていません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landmarks.map((landmark, i) => (
              <motion.div
                key={landmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/explore/${landmark.slug}`} className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    {landmark.photos?.[0] ? (
                      <Image src={landmark.photos[0]} alt={locale === 'ja' ? landmark.name_ja : landmark.name_en} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E8D5B7] to-[#D4AF37] flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-white" />
                      </div>
                    )}
                    {landmark.is_featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#D4AF37]">
                          <Star className="w-3 h-3 mr-1" />
                          {t('featured')}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">
                      {locale === 'ja' ? landmark.name_ja : landmark.name_en}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {landmark.location}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {locale === 'ja' ? landmark.description_ja : landmark.description_en}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
