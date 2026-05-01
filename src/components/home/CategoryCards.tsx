'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { User, Car, Map } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const categories = [
  {
    key: 'guides',
    href: '/guides',
    icon: User,
    color: 'bg-[#D4AF37]',
  },
  {
    key: 'pickup',
    href: '/airport-pickup',
    icon: Car,
    color: 'bg-[#1E5F8E]',
  },
  {
    key: 'explore',
    href: '/explore',
    icon: Map,
    color: 'bg-[#C84B31]',
  },
]

export default function CategoryCards() {
  const t = useTranslations('home.categories')

  return (
    <section className="py-20 px-4 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col items-center text-center group"
              >
                <div className={`${cat.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">
                  {t(`${cat.key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {t(`${cat.key}.description`)}
                </p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href={cat.href}>{t(`${cat.key}.cta`)}</Link>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
