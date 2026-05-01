'use client'
import { MessageCircle } from 'lucide-react'

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* LINE button */}
      <a
        href="https://line.me/R/ti/p/@your-line-id"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#00B900] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="LINE"
      >
        <span className="text-white font-bold text-sm">LINE</span>
      </a>
      {/* WhatsApp button */}
      <a
        href="https://wa.me/20XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  )
}
