'use client'
import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { AirportPickupService } from '@/types/database'

const emptyForm = { company_name: '', vehicle_type: '', capacity: 4, price_usd: 0, description_ja: '', description_en: '', photo_url: '', is_active: true }

export default function PickupAdminClient({ initialServices }: { initialServices: AirportPickupService[] }) {
  const [services, setServices] = useState<AirportPickupService[]>(initialServices)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AirportPickupService | null>(null)
  const [form, setForm] = useState(emptyForm)
  const _setUploading = (_v: boolean) => {}
  const supabase = createClient()

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (s: AirportPickupService) => {
    setEditing(s)
    setForm({ company_name: s.company_name, vehicle_type: s.vehicle_type, capacity: s.capacity, price_usd: s.price_usd, description_ja: s.description_ja, description_en: s.description_en, photo_url: s.photo_url || '', is_active: s.is_active })
    setOpen(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    _setUploading(true)
    try {
      const path = `pickup/${Date.now()}.${file.name.split('.').pop()}`
      await supabase.storage.from('images').upload(path, file)
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      setForm((f) => ({ ...f, photo_url: data.publicUrl }))
    } finally { _setUploading(false) }
  }

  const handleSave = async () => {
    const payload = { ...form, photo_url: form.photo_url || null }
    try {
      if (editing) {
        const { data } = await supabase.from('airport_pickup_services').update(payload).eq('id', editing.id).select().single()
        if (data) setServices((prev) => prev.map((s) => (s.id === editing.id ? data : s)))
      } else {
        const { data } = await supabase.from('airport_pickup_services').insert(payload).select().single()
        if (data) setServices((prev) => [data, ...prev])
      }
      setOpen(false)
    } catch { alert('保存に失敗しました') }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('airport_pickup_services').delete().eq('id', id)
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const toggleActive = async (s: AirportPickupService) => {
    const { data } = await supabase.from('airport_pickup_services').update({ is_active: !s.is_active }).eq('id', s.id).select().single()
    if (data) setServices((prev) => prev.map((x) => (x.id === s.id ? data : x)))
  }

  return (
    <AdminPageShell title="空港送迎管理" description="空港送迎サービスを管理">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />サービスを追加</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">会社名</th>
              <th className="text-left p-4 font-medium text-gray-500">車両</th>
              <th className="text-left p-4 font-medium text-gray-500">定員</th>
              <th className="text-left p-4 font-medium text-gray-500">料金</th>
              <th className="text-left p-4 font-medium text-gray-500">状態</th>
              <th className="text-right p-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{s.company_name}</td>
                <td className="p-4 text-gray-500">{s.vehicle_type}</td>
                <td className="p-4 text-gray-500">{s.capacity}名</td>
                <td className="p-4 font-bold text-[#D4AF37]">${s.price_usd}</td>
                <td className="p-4"><Switch checked={s.is_active} onCheckedChange={() => toggleActive(s)} /></td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>削除の確認</AlertDialogTitle><AlertDialogDescription>「{s.company_name}」を削除しますか？</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>キャンセル</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(s.id)}>削除</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">サービスがありません</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'サービスを編集' : 'サービスを追加'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>会社名</Label><Input value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>車両タイプ</Label><Input value={form.vehicle_type} onChange={(e) => setForm((f) => ({ ...f, vehicle_type: e.target.value }))} placeholder="セダン" /></div>
              <div><Label>定員（名）</Label><Input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: parseInt(e.target.value) || 1 }))} /></div>
              <div><Label>料金（USD）</Label><Input type="number" value={form.price_usd} onChange={(e) => setForm((f) => ({ ...f, price_usd: parseFloat(e.target.value) || 0 }))} /></div>
            </div>
            <div><Label>説明（日本語）</Label><Textarea value={form.description_ja} onChange={(e) => setForm((f) => ({ ...f, description_ja: e.target.value }))} rows={3} /></div>
            <div><Label>説明（英語）</Label><Textarea value={form.description_en} onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))} rows={3} /></div>
            <div><Label>写真アップロード</Label><input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm mt-1" /></div>
            <div><Label>写真URL</Label><Input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} /></div>
            {form.photo_url && <div className="relative h-32 rounded-lg overflow-hidden"><Image src={form.photo_url} alt="preview" fill className="object-cover" /></div>}
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} /><Label>公開する</Label></div>
            <Button onClick={handleSave} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}
