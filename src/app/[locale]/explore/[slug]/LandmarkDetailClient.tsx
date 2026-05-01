'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Lightbulb } from 'lucide-react'
import type { Landmark } from '@/types/database'

export default function LandmarkDetailClient({ landmark }: { landmark: Landmark }) {
  const t = useTranslations('explore')
  const locale = useLocale()
  const name = locale === 'ja' ? landmark.name_ja : landmark.name_en
  const description = locale === 'ja' ? landmark.description_ja : landmark.description_en
  const tips = locale === 'ja' ? landmark.tips_ja : landmark.tips_en

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/explore" className="inline-flex items-center gap-2 text-[#1E5F8E] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('title')}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Photo gallery */}
          {landmark.photos?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {landmark.photos.slice(0, 4).map((photo, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 h-72' : 'h-40'}`}>
                  <Image src={photo} alt={`${name} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-3">{name}</h1>
          <div className="flex items-center gap-2 text-gray-400 mb-8">
            <MapPin className="w-4 h-4" />
            {landmark.location}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
          </div>

          {tips && (
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-[#2C2C2C]">{t('tips')}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{tips}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
