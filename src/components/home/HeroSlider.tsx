'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { HeroImage } from '@/types/database'

const FALLBACK_IMAGES = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1600&q=80',
    alt_text_ja: 'ギザのピラミッド',
    alt_text_en: 'Pyramids of Giza',
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80',
    alt_text_ja: 'ルクソール神殿',
    alt_text_en: 'Luxor Temple',
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1608425093889-8f2f39df16c7?w=1600&q=80',
    alt_text_ja: 'ナイル川の夕暮れ',
    alt_text_en: 'Nile River Sunset',
  },
]

interface HeroSliderProps {
  images?: HeroImage[]
}

export default function HeroSlider({ images }: HeroSliderProps) {
  const t = useTranslations('home.hero')
  const displayImages = (images && images.length > 0) ? images : FALLBACK_IMAGES
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [displayImages.length])

  const prev = () => setCurrent((c) => (c - 1 + displayImages.length) % displayImages.length)
  const next = () => setCurrent((c) => (c + 1) % displayImages.length)

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-black">
      {displayImages.map((img, i) => (
        <motion.div
          key={img.id ?? i}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={img.image_url}
            alt={img.alt_text_ja}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </motion.div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
        >
          {t('title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-xl drop-shadow"
        >
          {t('subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-[#D4AF37] hover:bg-[#B8960C] text-white shadow-xl">
            <Link href="/guides">{t('cta')}</Link>
          </Button>
        </motion.div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {displayImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#D4AF37] w-6' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  )
}
