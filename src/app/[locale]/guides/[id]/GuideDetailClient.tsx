'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, Award, Clock, DollarSign, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Guide, Package } from '@/types/database'

interface GuideDetailClientProps {
  guide: Guide
  packages: Package[]
}

export default function GuideDetailClient({ guide, packages }: GuideDetailClientProps) {
  const t = useTranslations('guides')
  const locale = useLocale()

  const bio = locale === 'ja' ? guide.bio_ja : guide.bio_en

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link href="/guides" className="inline-flex items-center gap-2 text-[#1E5F8E] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('filter.all')}
        </Link>

        {/* Guide profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10"
        >
          <div className="md:flex">
            <div className="relative md:w-72 h-72 flex-shrink-0">
              {guide.photo_url ? (
                <Image src={guide.photo_url} alt={guide.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#E8D5B7] to-[#D4AF37] flex items-center justify-center">
                  <span className="text-7xl">👤</span>
                </div>
              )}
            </div>
            <div className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={guide.type === 'licensed' ? 'secondary' : 'sand'}>
                  {guide.type === 'licensed' ? t('licensed') : t('travelBuddy')}
                </Badge>
                {guide.type === 'licensed' && <Award className="w-5 h-5 text-[#D4AF37]" />}
              </div>
              <h1 className="text-3xl font-bold text-[#2C2C2C] mb-4">{guide.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{bio}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">{t('experience')}</span>
                  <p className="font-semibold">{guide.experience_years} {t('years')}</p>
                </div>
                {guide.license_number && (
                  <div>
                    <span className="text-gray-400">ライセンス番号</span>
                    <p className="font-semibold">{guide.license_number}</p>
                  </div>
                )}
              </div>
              {guide.languages?.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-400 text-sm">{t('languages')}</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {guide.languages.map((lang) => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {guide.specialties?.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-400 text-sm">専門分野</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {guide.specialties.map((s) => (
                      <Badge key={s} variant="sand">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Packages */}
        {packages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">{t('packages')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg, i) => (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="hover:shadow-lg transition-shadow">
                    {pkg.photo_url && (
                      <div className="relative h-48 rounded-t-lg overflow-hidden">
                        <Image src={pkg.photo_url} alt={locale === 'ja' ? pkg.title_ja : pkg.title_en} fill className="object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {locale === 'ja' ? pkg.title_ja : pkg.title_en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">
                        {locale === 'ja' ? pkg.description_ja : pkg.description_en}
                      </p>
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {pkg.duration}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-[#D4AF37]">
                          <DollarSign className="w-4 h-4" />
                          {pkg.price_usd} USD
                        </span>
                      </div>
                      {pkg.included_items?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-400 mb-2">{t('included')}</p>
                          <ul className="space-y-1">
                            {pkg.included_items.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button className="w-full" asChild>
                        <a href={`https://wa.me/20XXXXXXXXXX?text=${encodeURIComponent(`${pkg.title_ja}のご予約について`)}`} target="_blank" rel="noopener noreferrer">
                          {t('bookNow')}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
