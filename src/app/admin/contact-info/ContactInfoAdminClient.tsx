'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Mail, MessageCircle, Phone, Share2, Link2, MapPin } from 'lucide-react'
import type { ContactInfo } from '@/types/database'

export default function ContactInfoAdminClient({ initialContact }: { initialContact: ContactInfo | null }) {
  const [form, setForm] = useState({
    email: initialContact?.email || '',
    whatsapp: initialContact?.whatsapp || '',
    line_id: initialContact?.line_id || '',
    instagram: initialContact?.instagram || '',
    facebook: initialContact?.facebook || '',
    address: initialContact?.address || '',
  })
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    try {
      if (initialContact) {
        await supabase.from('contact_info').update(form).eq('id', initialContact.id)
      } else {
        await supabase.from('contact_info').insert(form)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { alert('保存に失敗しました') }
  }

  const fields = [
    { key: 'email', label: 'メールアドレス', icon: Mail, placeholder: 'contact@example.com', type: 'email' },
    { key: 'whatsapp', label: 'WhatsApp番号', icon: MessageCircle, placeholder: '+20-XXX-XXX-XXXX', type: 'text' },
    { key: 'line_id', label: 'LINE ID', icon: Phone, placeholder: '@your-line-id', type: 'text' },
    { key: 'instagram', label: 'Instagram URL', icon: Share2, placeholder: 'https://instagram.com/...', type: 'url' },
    { key: 'facebook', label: 'Facebook URL', icon: Link2, placeholder: 'https://facebook.com/...', type: 'url' },
    { key: 'address', label: '住所', icon: MapPin, placeholder: 'Cairo, Egypt', type: 'text' },
  ]

  return (
    <AdminPageShell title="連絡先情報" description="サイトの連絡先情報を管理">
      <div className="max-w-2xl bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-5">
          {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
            <div key={key}>
              <Label className="flex items-center gap-2"><Icon className="w-4 h-4 text-[#D4AF37]" />{label}</Label>
              <Input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="mt-1"
              />
            </div>
          ))}
          <Button onClick={handleSave} className="w-full mt-4">
            <Save className="w-4 h-4 mr-2" />
            {saved ? '保存しました！' : '保存'}
          </Button>
        </div>
      </div>
    </AdminPageShell>
  )
}
