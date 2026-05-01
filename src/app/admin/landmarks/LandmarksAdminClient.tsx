'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import type { Landmark } from '@/types/database'

const emptyForm = { name_ja: '', name_en: '', slug: '', description_ja: '', description_en: '', location: '', tips_ja: '', tips_en: '', photos: '', is_featured: false }

export default function LandmarksAdminClient({ initialLandmarks }: { initialLandmarks: Landmark[] }) {
  const [landmarks, setLandmarks] = useState<Landmark[]>(initialLandmarks)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Landmark | null>(null)
  const [form, setForm] = useState(emptyForm)
  const supabase = createClient()

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (l: Landmark) => {
    setEditing(l)
    setForm({ name_ja: l.name_ja, name_en: l.name_en, slug: l.slug, description_ja: l.description_ja, description_en: l.description_en, location: l.location, tips_ja: l.tips_ja, tips_en: l.tips_en, photos: (l.photos || []).join('\n'), is_featured: l.is_featured })
    setOpen(true)
  }

  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSave = async () => {
    const payload = { ...form, photos: form.photos.split('\n').map((s) => s.trim()).filter(Boolean), slug: form.slug || generateSlug(form.name_en) }
    try {
      if (editing) {
        const { data } = await supabase.from('landmarks').update(payload).eq('id', editing.id).select().single()
        if (data) setLandmarks((prev) => prev.map((l) => (l.id === editing.id ? data : l)))
      } else {
        const { data } = await supabase.from('landmarks').insert(payload).select().single()
        if (data) setLandmarks((prev) => [...prev, data])
      }
      setOpen(false)
    } catch { alert('保存に失敗しました') }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('landmarks').delete().eq('id', id)
    setLandmarks((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <AdminPageShell title="ランドマーク管理" description="エジプトの観光地を管理">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />ランドマークを追加</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">名前（日本語）</th>
              <th className="text-left p-4 font-medium text-gray-500">スラッグ</th>
              <th className="text-left p-4 font-medium text-gray-500">場所</th>
              <th className="text-left p-4 font-medium text-gray-500">おすすめ</th>
              <th className="text-right p-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {landmarks.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{l.name_ja}</td>
                <td className="p-4 text-gray-400 text-xs font-mono">{l.slug}</td>
                <td className="p-4 text-gray-500">{l.location}</td>
                <td className="p-4">{l.is_featured && <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>削除の確認</AlertDialogTitle><AlertDialogDescription>「{l.name_ja}」を削除しますか？</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>キャンセル</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(l.id)}>削除</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {landmarks.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400">ランドマークがありません</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'ランドマークを編集' : 'ランドマークを追加'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>名前（日本語）</Label><Input value={form.name_ja} onChange={(e) => setForm((f) => ({ ...f, name_ja: e.target.value }))} /></div>
              <div><Label>名前（英語）</Label><Input value={form.name_en} onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value, slug: generateSlug(e.target.value) }))} /></div>
            </div>
            <div><Label>スラッグ（URL用）</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></div>
            <div><Label>場所</Label><Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="カイロ, エジプト" /></div>
            <div><Label>説明（日本語）</Label><Textarea value={form.description_ja} onChange={(e) => setForm((f) => ({ ...f, description_ja: e.target.value }))} rows={4} /></div>
            <div><Label>説明（英語）</Label><Textarea value={form.description_en} onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))} rows={4} /></div>
            <div><Label>旅のヒント（日本語）</Label><Textarea value={form.tips_ja} onChange={(e) => setForm((f) => ({ ...f, tips_ja: e.target.value }))} rows={3} /></div>
            <div><Label>旅のヒント（英語）</Label><Textarea value={form.tips_en} onChange={(e) => setForm((f) => ({ ...f, tips_en: e.target.value }))} rows={3} /></div>
            <div><Label>写真URL（1行1URL）</Label><Textarea value={form.photos} onChange={(e) => setForm((f) => ({ ...f, photos: e.target.value }))} rows={3} placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg" /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} /><Label>おすすめに設定</Label></div>
            <Button onClick={handleSave} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}
