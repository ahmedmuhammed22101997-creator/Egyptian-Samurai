'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Phone, Share2, Link2, MapPin } from 'lucide-react'
import type { ContactInfo } from '@/types/database'

export default function ContactClient({ contact }: { contact: ContactInfo | null }) {
  const t = useTranslations('contact')
  const email = contact?.email || 'contact@example.com'
  const whatsapp = contact?.whatsapp || '+20-XXX-XXX-XXXX'
  const lineId = contact?.line_id || '@your-line-id'

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]">
      <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8960C] py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8">お問い合わせ先</h2>
            <div className="space-y-6">
              <a href={`mailto:${email}`} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
              </a>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <p className="font-medium">{whatsapp}</p>
                </div>
              </a>
              <a href={`https://line.me/R/ti/p/${lineId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#00B900]/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#00B900]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">LINE</p>
                  <p className="font-medium">{lineId}</p>
                </div>
              </a>
              {contact?.address && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-[#1E5F8E]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#1E5F8E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">住所</p>
                    <p className="font-medium">{contact.address}</p>
                  </div>
                </div>
              )}
            </div>
            {contact && (contact.instagram || contact.facebook) && (
              <div className="flex gap-4 mt-6">
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4AF37] transition-colors">
                    <Share2 className="w-5 h-5" /> Instagram
                  </a>
                )}
                {contact.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4AF37] transition-colors">
                    <Link2 className="w-5 h-5" /> Facebook
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Map placeholder */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-gradient-to-br from-[#E8D5B7] to-[#D4AF37]/30 rounded-2xl h-80 flex items-center justify-center shadow-inner">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-[#D4AF37]" />
                <p className="font-medium">Egypt</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
