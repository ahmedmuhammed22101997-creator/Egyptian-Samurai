'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Phone, Share2, Link2 } from 'lucide-react'
import type { ContactInfo } from '@/types/database'

interface ContactSectionProps {
  contact: ContactInfo | null
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const t = useTranslations('home.contact')

  const email = contact?.email || 'contact@example.com'
  const whatsapp = contact?.whatsapp || '+20-XXX-XXX-XXXX'
  const lineId = contact?.line_id || '@your-line-id'

  return (
    <section className="py-20 px-4 bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-12">{t('title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.a
            href={`mailto:${email}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
              <Mail className="w-7 h-7 text-[#D4AF37] group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold text-[#2C2C2C]">{t('email')}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </motion.a>

          <motion.a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="w-14 h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
              <MessageCircle className="w-7 h-7 text-[#25D366] group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold text-[#2C2C2C]">{t('whatsapp')}</span>
            <span className="text-sm text-gray-500">{whatsapp}</span>
          </motion.a>

          <motion.a
            href={`https://line.me/R/ti/p/${lineId}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="w-14 h-14 bg-[#00B900]/10 rounded-full flex items-center justify-center group-hover:bg-[#00B900] transition-colors">
              <Phone className="w-7 h-7 text-[#00B900] group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold text-[#2C2C2C]">{t('line')}</span>
            <span className="text-sm text-gray-500">{lineId}</span>
          </motion.a>
        </div>

        {contact && (contact.instagram || contact.facebook) && (
          <div className="flex justify-center gap-4 mt-8">
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-transform">
                <Link2 className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
