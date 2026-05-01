'use client'
import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { HeroImage } from '@/types/database'

interface HeroImagesClientProps {
  initialImages: HeroImage[]
}

const emptyForm = { image_url: '', alt_text_ja: '', alt_text_en: '', display_order: 0, is_active: true }

export default function HeroImagesClient({ initialImages }: HeroImagesClientProps) {
  const [images, setImages] = useState<HeroImage[]>(initialImages)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<HeroImage | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, display_order: images.length + 1 })
    setOpen(true)
  }

  const openEdit = (img: HeroImage) => {
    setEditing(img)
    setForm({ image_url: img.image_url, alt_text_ja: img.alt_text_ja, alt_text_en: img.alt_text_en, display_order: img.display_order, is_active: img.is_active })
    setOpen(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `hero/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('images').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      setForm((f) => ({ ...f, image_url: data.publicUrl }))
    } catch {
      alert('アップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editing) {
        const { data } = await supabase.from('hero_images').update(form).eq('id', editing.id).select().single()
        if (data) setImages((prev) => prev.map((i) => (i.id === editing.id ? data : i)))
      } else {
        const { data } = await supabase.from('hero_images').insert(form).select().single()
        if (data) setImages((prev) => [...prev, data])
      }
      setOpen(false)
    } catch { alert('保存に失敗しました') }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('hero_images').delete().eq('id', id)
    setImages((prev) => prev.filter((i) => i.id !== id))
  }

  const toggleActive = async (img: HeroImage) => {
    const { data } = await supabase.from('hero_images').update({ is_active: !img.is_active }).eq('id', img.id).select().single()
    if (data) setImages((prev) => prev.map((i) => (i.id === img.id ? data : i)))
  }

  return (
    <AdminPageShell title="ヒーロー画像管理" description="ホームページのスライダー画像を管理">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          画像を追加
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-40">
              <Image src={img.image_url} alt={img.alt_text_ja} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 text-xs font-medium">
                #{img.display_order}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-[#2C2C2C] mb-1">{img.alt_text_ja}</p>
              <p className="text-xs text-gray-400 mb-3">{img.alt_text_en}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={img.is_active} onCheckedChange={() => toggleActive(img)} />
                  <span className="text-xs text-gray-500">{img.is_active ? '表示中' : '非表示'}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(img)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>削除の確認</AlertDialogTitle>
                        <AlertDialogDescription>この画像を削除しますか？この操作は取り消せません。</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(img.id)}>削除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? '画像を編集' : '画像を追加'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>画像アップロード</Label>
              <input type="file" accept="image/*" onChange={handleUpload} className="mt-1 block w-full text-sm" />
              {uploading && <p className="text-xs text-gray-400 mt-1">アップロード中...</p>}
            </div>
            <div>
              <Label>画像URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
            </div>
            {form.image_url && (
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image src={form.image_url} alt="preview" fill className="object-cover" />
              </div>
            )}
            <div>
              <Label>代替テキスト（日本語）</Label>
              <Input value={form.alt_text_ja} onChange={(e) => setForm((f) => ({ ...f, alt_text_ja: e.target.value }))} />
            </div>
            <div>
              <Label>代替テキスト（英語）</Label>
              <Input value={form.alt_text_en} onChange={(e) => setForm((f) => ({ ...f, alt_text_en: e.target.value }))} />
            </div>
            <div>
              <Label>表示順</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
              <Label>表示する</Label>
            </div>
            <Button onClick={handleSave} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}
