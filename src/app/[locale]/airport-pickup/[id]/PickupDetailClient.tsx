'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, Car, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AirportPickupService } from '@/types/database'

export default function PickupDetailClient({ service }: { service: AirportPickupService }) {
  const t = useTranslations('pickup')
  const locale = useLocale()

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/airport-pickup" className="inline-flex items-center gap-2 text-[#1E5F8E] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('title')}
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {service.photo_url && (
            <div className="relative h-72">
              <Image src={service.photo_url} alt={service.company_name} fill className="object-cover" />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#2C2C2C] mb-6">{service.company_name}</h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-[#FDFBF7] rounded-xl">
                <Car className="w-6 h-6 text-[#C84B31] mx-auto mb-2" />
                <p className="text-xs text-gray-400">{t('vehicle')}</p>
                <p className="font-semibold text-sm">{service.vehicle_type}</p>
              </div>
              <div className="text-center p-4 bg-[#FDFBF7] rounded-xl">
                <Users className="w-6 h-6 text-[#1E5F8E] mx-auto mb-2" />
                <p className="text-xs text-gray-400">{t('capacity')}</p>
                <p className="font-semibold text-sm">{service.capacity}名</p>
              </div>
              <div className="text-center p-4 bg-[#FDFBF7] rounded-xl">
                <DollarSign className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-xs text-gray-400">{t('price')}</p>
                <p className="font-semibold text-sm">{service.price_usd} USD</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8">
              {locale === 'ja' ? service.description_ja : service.description_en}
            </p>
            <Button asChild size="lg" className="w-full md:w-auto">
              <a href="https://wa.me/20XXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                {t('bookNow')}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
