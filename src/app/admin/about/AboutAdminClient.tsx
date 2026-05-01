'use client'
import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import type { AboutContent } from '@/types/database'

export default function AboutAdminClient({ initialAbout }: { initialAbout: AboutContent | null }) {
  const [form, setForm] = useState({
    title_ja: initialAbout?.title_ja || '',
    title_en: initialAbout?.title_en || '',
    content_ja: initialAbout?.content_ja || '',
    content_en: initialAbout?.content_en || '',
    photo_url: initialAbout?.photo_url || '',
  })
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const path = `about/${Date.now()}.${file.name.split('.').pop()}`
      await supabase.storage.from('images').upload(path, file)
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      setForm((f) => ({ ...f, photo_url: data.publicUrl }))
    } finally { setUploading(false) }
  }

  const handleSave = async () => {
    try {
      const payload = { ...form, photo_url: form.photo_url || null }
      if (initialAbout) {
        await supabase.from('about_content').update(payload).eq('id', initialAbout.id)
      } else {
        await supabase.from('about_content').insert(payload)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { alert('保存に失敗しました') }
  }

  return (
    <AdminPageShell title="私たちについて" description="About Usセクションのコンテンツを編集">
      <div className="max-w-3xl bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>タイトル（日本語）</Label><Input value={form.title_ja} onChange={(e) => setForm((f) => ({ ...f, title_ja: e.target.value }))} /></div>
            <div><Label>タイトル（英語）</Label><Input value={form.title_en} onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))} /></div>
          </div>
          <div><Label>本文（日本語）</Label><Textarea value={form.content_ja} onChange={(e) => setForm((f) => ({ ...f, content_ja: e.target.value }))} rows={8} /></div>
          <div><Label>本文（英語）</Label><Textarea value={form.content_en} onChange={(e) => setForm((f) => ({ ...f, content_en: e.target.value }))} rows={8} /></div>
          <div><Label>写真アップロード</Label><input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm mt-1" />{uploading && <p className="text-xs text-gray-400 mt-1">アップロード中...</p>}</div>
          <div><Label>写真URL</Label><Input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} /></div>
          {form.photo_url && (
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image src={form.photo_url} alt="preview" fill className="object-cover" />
            </div>
          )}
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {saved ? '保存しました！' : '保存'}
          </Button>
        </div>
      </div>
    </AdminPageShell>
  )
}
