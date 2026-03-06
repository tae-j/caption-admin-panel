import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function ImagesPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editImg, setEditImg] = useState(null)
  const [editUrl, setEditUrl] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { loadImages() }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function loadImages() {
    const { data } = await supabase.from('images').select('*, profiles(username)').order('created_at', { ascending: false })
    setImages(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return
    await supabase.from('images').delete().eq('id', id)
    setImages(prev => prev.filter(i => i.id !== id))
    showToast('Image deleted')
  }

  async function handleUpdate() {
    setSaving(true)
    await supabase.from('images').update({ url: editUrl }).eq('id', editImg.id)
    setImages(prev => prev.map(i => i.id === editImg.id ? { ...i, url: editUrl } : i))
    setEditImg(null)
    setSaving(false)
    showToast('Image updated')
  }

  async function handleAdd() {
    if (!newUrl.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('images').insert({ url: newUrl.trim(), profile_id: user.id }).select('*, profiles(username)').single()
    if (!error && data) {
      setImages(prev => [data, ...prev])
      showToast('Image added')
    }
    setNewUrl('')
    setAddOpen(false)
    setSaving(false)
  }

  const filtered = images.filter(i =>
    i.url?.toLowerCase().includes(search.toLowerCase()) ||
    i.profiles?.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>CRUD</div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Images</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>+ Add Image</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input placeholder="Search by URL or username..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Preview</th>
                <th>URL</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(img => (
                <tr key={img.id}>
                  <td>
                    <img src={img.url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, background: 'var(--bg3)' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.url}
                  </td>
                  <td>{img.profiles?.username || <span style={{ color: 'var(--text2)' }}>—</span>}</td>
                  <td style={{ color: 'var(--text2)', fontSize: 12 }}>{img.created_at ? new Date(img.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditImg(img); setEditUrl(img.url) }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(img.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5}><div className="empty-state">No images found</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)' }}>{filtered.length} images</div>

      {editImg && (
        <Modal title="Edit Image URL" onClose={() => setEditImg(null)}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Image URL</label>
            <input value={editUrl} onChange={e => setEditUrl(e.target.value)} />
          </div>
          {editUrl && <img src={editUrl} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 20, background: 'var(--bg3)' }} onError={e => e.target.style.display='none'} />}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setEditImg(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </Modal>
      )}

      {addOpen && (
        <Modal title="Add New Image" onClose={() => setAddOpen(false)}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Image URL</label>
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd} disabled={saving || !newUrl.trim()}>{saving ? 'Adding...' : 'Add Image'}</button>
          </div>
        </Modal>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✓' : '✗'} {toast.msg}</div>}
    </div>
  )
}