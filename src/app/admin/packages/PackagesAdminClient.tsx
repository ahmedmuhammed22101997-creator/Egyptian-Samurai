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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react'

interface PackageRow {
  id: string
  guide_id: string
  title_ja: string
  title_en: string
  description_ja: string
  description_en: string
  duration: string
  price_usd: number
  included_items: string[]
  photo_url: string | null
  is_active: boolean
  created_at: string
  guide?: { name: string }
}

const emptyForm = {
  guide_id: '', title_ja: '', title_en: '', description_ja: '', description_en: '',
  duration: '', price_usd: 0, included_items: '', photo_url: '', is_active: true
}

export default function PackagesAdminClient({ initialPackages, guides }: { initialPackages: PackageRow[], guides: { id: string, name: string }[] }) {
  const [packages, setPackages] = useState<PackageRow[]>(initialPackages)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PackageRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const _setUploading = (_v: boolean) => {}
  const supabase = createClient()

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (p: PackageRow) => {
    setEditing(p)
    setForm({ guide_id: p.guide_id, title_ja: p.title_ja, title_en: p.title_en, description_ja: p.description_ja, description_en: p.description_en, duration: p.duration, price_usd: p.price_usd, included_items: (p.included_items || []).join('\n'), photo_url: p.photo_url || '', is_active: p.is_active })
    setOpen(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    _setUploading(true)
    try {
      const path = `packages/${Date.now()}.${file.name.split('.').pop()}`
      await supabase.storage.from('images').upload(path, file)
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      setForm((f) => ({ ...f, photo_url: data.publicUrl }))
    } finally { _setUploading(false) }
  }

  const handleSave = async () => {
    const payload = { ...form, included_items: form.included_items.split('\n').map((s) => s.trim()).filter(Boolean), photo_url: form.photo_url || null }
    try {
      if (editing) {
        const { data } = await supabase.from('packages').update(payload).eq('id', editing.id).select('*, guide:guides(name)').single()
        if (data) setPackages((prev) => prev.map((p) => (p.id === editing.id ? data as PackageRow : p)))
      } else {
        const { data } = await supabase.from('packages').insert(payload).select('*, guide:guides(name)').single()
        if (data) setPackages((prev) => [data as PackageRow, ...prev])
      }
      setOpen(false)
    } catch { alert('保存に失敗しました') }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('packages').delete().eq('id', id)
    setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = async (p: PackageRow) => {
    const { data } = await supabase.from('packages').update({ is_active: !p.is_active }).eq('id', p.id).select('*, guide:guides(name)').single()
    if (data) setPackages((prev) => prev.map((x) => (x.id === p.id ? data as PackageRow : x)))
  }

  return (
    <AdminPageShell title="パッケージ管理" description="ツアーパッケージを管理">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />パッケージを追加</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">パッケージ名</th>
              <th className="text-left p-4 font-medium text-gray-500">ガイド</th>
              <th className="text-left p-4 font-medium text-gray-500">期間</th>
              <th className="text-left p-4 font-medium text-gray-500">料金</th>
              <th className="text-left p-4 font-medium text-gray-500">状態</th>
              <th className="text-right p-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {packages.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{p.title_ja}</td>
                <td className="p-4 text-gray-500">{p.guide?.name || '-'}</td>
                <td className="p-4 text-gray-500">{p.duration}</td>
                <td className="p-4"><span className="flex items-center gap-1 text-[#D4AF37] font-bold"><DollarSign className="w-3.5 h-3.5" />{p.price_usd}</span></td>
                <td className="p-4"><Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} /></td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>削除の確認</AlertDialogTitle><AlertDialogDescription>このパッケージを削除しますか？</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>キャンセル</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id)}>削除</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {packages.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">パッケージがありません</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'パッケージを編集' : 'パッケージを追加'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ガイド</Label>
              <Select value={form.guide_id} onValueChange={(v) => setForm((f) => ({ ...f, guide_id: v }))}>
                <SelectTrigger><SelectValue placeholder="ガイドを選択" /></SelectTrigger>
                <SelectContent>{guides.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>タイトル（日本語）</Label><Input value={form.title_ja} onChange={(e) => setForm((f) => ({ ...f, title_ja: e.target.value }))} /></div>
              <div><Label>タイトル（英語）</Label><Input value={form.title_en} onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))} /></div>
            </div>
            <div><Label>説明（日本語）</Label><Textarea value={form.description_ja} onChange={(e) => setForm((f) => ({ ...f, description_ja: e.target.value }))} rows={3} /></div>
            <div><Label>説明（英語）</Label><Textarea value={form.description_en} onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>期間</Label><Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="例：1日, 3時間" /></div>
              <div><Label>料金（USD）</Label><Input type="number" value={form.price_usd} onChange={(e) => setForm((f) => ({ ...f, price_usd: parseFloat(e.target.value) || 0 }))} /></div>
            </div>
            <div><Label>含まれるもの（1行1項目）</Label><Textarea value={form.included_items} onChange={(e) => setForm((f) => ({ ...f, included_items: e.target.value }))} rows={4} placeholder="車での移動&#10;ランチ&#10;入場料" /></div>
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
