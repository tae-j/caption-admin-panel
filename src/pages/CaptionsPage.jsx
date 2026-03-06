import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CaptionsPage() {
  const [captions, setCaptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadCaptions() }, [])

  async function loadCaptions() {
    const { data } = await supabase
      .from('captions')
      .select('*, profiles(username), images(url)')
      .order('created_at', { ascending: false })
    setCaptions(data || [])
    setLoading(false)
  }

  const filtered = captions.filter(c =>
    c.caption_text?.toLowerCase().includes(search.toLowerCase()) ||
    c.profiles?.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Read-only</div>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Captions</h1>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input placeholder="Search captions or username..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Caption</th>
                <th>By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    {c.images?.url
                      ? <img src={c.images.url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, background: 'var(--bg3)' }} onError={e => e.target.style.display='none'} />
                      : <span style={{ color: 'var(--text2)' }}>—</span>}
                  </td>
                  <td style={{ maxWidth: 400 }}>{c.caption_text}</td>
                  <td>{c.profiles?.username || <span style={{ color: 'var(--text2)' }}>—</span>}</td>
                  <td style={{ color: 'var(--text2)', fontSize: 12 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state">No captions found</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)' }}>{filtered.length} captions</div>
    </div>
  )
}