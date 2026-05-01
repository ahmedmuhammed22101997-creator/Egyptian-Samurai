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
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import type { Guide } from '@/types/database'

const emptyForm = {
  name: '', type: 'licensed' as 'licensed' | 'travel_buddy', bio_ja: '', bio_en: '',
  photo_url: '', languages: '', experience_years: 0, license_number: '', specialties: '', is_active: true
}

export default function GuidesAdminClient({ initialGuides }: { initialGuides: Guide[] }) {
  const [guides, setGuides] = useState<Guide[]>(initialGuides)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Guide | null>(null)
  const [form, setForm] = useState(emptyForm)
  const _setUploading = (_v: boolean) => {}
  const supabase = createClient()

  const filtered = guides.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (g: Guide) => {
    setEditing(g)
    setForm({
      name: g.name, type: g.type, bio_ja: g.bio_ja, bio_en: g.bio_en,
      photo_url: g.photo_url || '', languages: (g.languages || []).join(', '),
      experience_years: g.experience_years, license_number: g.license_number || '',
      specialties: (g.specialties || []).join(', '), is_active: g.is_active,
    })
    setOpen(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    _setUploading(true)
    try {
      const path = `guides/${Date.now()}.${file.name.split('.').pop()}`
      await supabase.storage.from('images').upload(path, file)
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      setForm((f) => ({ ...f, photo_url: data.publicUrl }))
    } finally { _setUploading(false) }
  }

  const handleSave = async () => {
    const payload = {
      ...form,
      languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
      specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      license_number: form.license_number || null,
      photo_url: form.photo_url || null,
    }
    try {
      if (editing) {
        const { data } = await supabase.from('guides').update(payload).eq('id', editing.id).select().single()
        if (data) setGuides((prev) => prev.map((g) => (g.id === editing.id ? data : g)))
      } else {
        const { data } = await supabase.from('guides').insert(payload).select().single()
        if (data) setGuides((prev) => [data, ...prev])
      }
      setOpen(false)
    } catch { alert('保存に失敗しました') }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('guides').delete().eq('id', id)
    setGuides((prev) => prev.filter((g) => g.id !== id))
  }

  const toggleActive = async (g: Guide) => {
    const { data } = await supabase.from('guides').update({ is_active: !g.is_active }).eq('id', g.id).select().single()
    if (data) setGuides((prev) => prev.map((x) => (x.id === g.id ? data : x)))
  }

  return (
    <AdminPageShell title="ガイド管理" description="ツアーガイド・トラベルバディを管理">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" />
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />ガイドを追加</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">ガイド</th>
              <th className="text-left p-4 font-medium text-gray-500">タイプ</th>
              <th className="text-left p-4 font-medium text-gray-500">経験</th>
              <th className="text-left p-4 font-medium text-gray-500">状態</th>
              <th className="text-right p-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#E8D5B7] flex-shrink-0">
                      {g.photo_url ? <Image src={g.photo_url} alt={g.name} fill className="object-cover" /> : <span className="flex items-center justify-center h-full text-lg">👤</span>}
                    </div>
                    <div>
                      <p className="font-medium">{g.name}</p>
                      <p className="text-xs text-gray-400">{(g.languages || []).join(', ')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={g.type === 'licensed' ? 'secondary' : 'sand'}>
                    {g.type === 'licensed' ? '公認ガイド' : 'トラベルバディ'}
                  </Badge>
                </td>
                <td className="p-4 text-gray-500">{g.experience_years}年</td>
                <td className="p-4">
                  <Switch checked={g.is_active} onCheckedChange={() => toggleActive(g)} />
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(g)}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>削除の確認</AlertDialogTitle><AlertDialogDescription>「{g.name}」を削除しますか？</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>キャンセル</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(g.id)}>削除</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400">ガイドがいません</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'ガイドを編集' : 'ガイドを追加'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>名前</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div>
                <Label>タイプ</Label>
                <Select value={form.type} onValueChange={(v: 'licensed' | 'travel_buddy') => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="licensed">公認ガイド</SelectItem><SelectItem value="travel_buddy">トラベルバディ</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>写真アップロード</Label><input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm mt-1" /></div>
            {form.photo_url && <div className="relative h-24 w-24 rounded-lg overflow-hidden"><Image src={form.photo_url} alt="preview" fill className="object-cover" /></div>}
            <div><Label>写真URL</Label><Input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} /></div>
            <div><Label>自己紹介（日本語）</Label><Textarea value={form.bio_ja} onChange={(e) => setForm((f) => ({ ...f, bio_ja: e.target.value }))} rows={3} /></div>
            <div><Label>自己紹介（英語）</Label><Textarea value={form.bio_en} onChange={(e) => setForm((f) => ({ ...f, bio_en: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>経験年数</Label><Input type="number" value={form.experience_years} onChange={(e) => setForm((f) => ({ ...f, experience_years: parseInt(e.target.value) || 0 }))} /></div>
              <div><Label>ライセンス番号</Label><Input value={form.license_number} onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))} /></div>
            </div>
            <div><Label>対応言語（カンマ区切り）</Label><Input value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} placeholder="日本語, 英語, アラビア語" /></div>
            <div><Label>専門分野（カンマ区切り）</Label><Input value={form.specialties} onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))} placeholder="歴史, 文化, 食事" /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} /><Label>公開する</Label></div>
            <Button onClick={handleSave} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}
