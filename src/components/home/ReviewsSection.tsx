'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Review } from '@/types/database'

interface ReviewsSectionProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const t = useTranslations('home.reviews')
  const locale = useLocale()
  const [current, setCurrent] = useState(0)

  if (!reviews || reviews.length === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent((c) => (c + 1) % reviews.length)

  const review = reviews[current]
  const reviewText = locale === 'ja' ? review.review_ja : review.review_en

  return (
    <section className="py-20 px-4 bg-[#1E5F8E]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">{t('title')}</h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                {review.photo_url ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={review.photo_url} alt={review.client_name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#E8D5B7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D4AF37] font-bold text-xl">{review.client_name.charAt(0)}</span>
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-[#2C2C2C]">{review.client_name}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed italic">&ldquo;{reviewText}&rdquo;</p>
            </motion.div>
          </AnimatePresence>

          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={prev} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#D4AF37] w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
              <button onClick={next} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
