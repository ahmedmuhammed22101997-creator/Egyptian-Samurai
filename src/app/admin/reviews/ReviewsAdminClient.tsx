'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import type { Review } from '@/types/database'

const emptyForm = { client_name: '', review_ja: '', review_en: '', rating: 5, photo_url: '', service_type: 'guide' as 'guide' | 'airport_pickup' | 'landmark' }

export default function ReviewsAdminClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Review | null>(null)
  const [form, setForm] = useState(emptyForm)
  const supabase = createClient()

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (r: Review) => {
    setEditing(r)
    setForm({ client_name: r.client_name, review_ja: r.review_ja, review_en: r.review_en, rating: r.rating, photo_url: r.photo_url || '', service_type: r.service_type })
    setOpen(true)
  }

  const handleSave = async () => {
    const payload = { ...form, photo_url: form.photo_url || null }
    try {
      if (editing) {
        const { data } = await supabase.from('reviews').update(payload).eq('id', editing.id).select().single()
        if (data) setReviews((prev) => prev.map((r) => (r.id === editing.id ? data : r)))
      } else {
        const { data } = await supabase.from('reviews').insert(payload).select().single()
        if (data) setReviews((prev) => [data, ...prev])
      }
      setOpen(false)
    } catch { alert('保存に失敗しました') }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id)
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <AdminPageShell title="レビュー管理" description="お客様のレビューを管理">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />レビューを追加</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-[#2C2C2C]">{r.client_name}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>削除の確認</AlertDialogTitle><AlertDialogDescription>このレビューを削除しますか？</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>キャンセル</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(r.id)}>削除</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">{r.review_ja}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-center py-20 text-gray-400 col-span-2">レビューがありません</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'レビューを編集' : 'レビューを追加'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>お客様名</Label><Input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>評価（1-5）</Label>
                <Select value={String(form.rating)} onValueChange={(v) => setForm((f) => ({ ...f, rating: parseInt(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[5, 4, 3, 2, 1].map((n) => <SelectItem key={n} value={String(n)}>{'⭐'.repeat(n)} ({n})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>サービスタイプ</Label>
                <Select value={form.service_type} onValueChange={(v: 'guide' | 'airport_pickup' | 'landmark') => setForm((f) => ({ ...f, service_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="guide">ガイド</SelectItem><SelectItem value="airport_pickup">空港送迎</SelectItem><SelectItem value="landmark">観光地</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>レビュー（日本語）</Label><Textarea value={form.review_ja} onChange={(e) => setForm((f) => ({ ...f, review_ja: e.target.value }))} rows={4} /></div>
            <div><Label>レビュー（英語）</Label><Textarea value={form.review_en} onChange={(e) => setForm((f) => ({ ...f, review_en: e.target.value }))} rows={4} /></div>
            <div><Label>写真URL（任意）</Label><Input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} /></div>
            <Button onClick={handleSave} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}
