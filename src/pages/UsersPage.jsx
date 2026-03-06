import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Read-only</div>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Users</h1>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input placeholder="Search by username or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>ID</th>
                <th>Superadmin</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.username || <span style={{ color: 'var(--text2)' }}>—</span>}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>{u.id}</td>
                  <td>
                    {u.is_superadmin
                      ? <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>✓ yes</span>
                      : <span style={{ color: 'var(--text2)', fontSize: 11 }}>—</span>}
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: 12 }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state">No users found</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)' }}>{filtered.length} users</div>
    </div>
  )
}