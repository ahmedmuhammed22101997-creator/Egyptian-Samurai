'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Car, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AirportPickupService } from '@/types/database'

interface AirportPickupClientProps {
  services: AirportPickupService[]
}

export default function AirportPickupClient({ services }: AirportPickupClientProps) {
  const t = useTranslations('pickup')
  const locale = useLocale()

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="bg-gradient-to-br from-[#C84B31] to-[#A83B21] py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-white/80">{t('subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Car className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">サービスはまだ登録されていません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative h-52">
                  {service.photo_url ? (
                    <Image src={service.photo_url} alt={service.company_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#E8D5B7] to-[#C84B31] flex items-center justify-center">
                      <Car className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">{service.company_name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {locale === 'ja' ? service.description_ja : service.description_en}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      {service.vehicle_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {service.capacity}名
                    </span>
                    <span className="flex items-center gap-1 font-bold text-[#D4AF37]">
                      <DollarSign className="w-4 h-4" />
                      {service.price_usd} USD
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/airport-pickup/${service.id}`}>{t('viewDetails')}</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <a href={`https://wa.me/20XXXXXXXXXX`} target="_blank" rel="noopener noreferrer">
                        {t('bookNow')}
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
