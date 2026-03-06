import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card" style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono)', color, lineHeight: 1 }}>{value ?? '—'}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 26, opacity: 0.4 }}>{icon}</div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ color: 'var(--text2)' }}>{label}</div>
      <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{payload[0].value}</div>
    </div>
  )
  return null
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [captionDist, setCaptionDist] = useState([])
  const [userGrowth, setUserGrowth] = useState([])
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [
      { count: totalUsers },
      { count: totalImages },
      { count: totalCaptions },
      { count: superadmins },
      { data: profiles },
      { data: images },
      { data: captions },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('images').select('*', { count: 'exact', head: true }),
      supabase.from('captions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_superadmin', true),
      supabase.from('profiles').select('id, username, created_at').order('created_at'),
      supabase.from('images').select('id, profile_id'),
      supabase.from('captions').select('id, image_id'),
    ])

    setStats({
      totalUsers, totalImages, totalCaptions, superadmins,
      avg: totalImages ? (totalCaptions / totalImages).toFixed(1) : 0
    })

    // Caption distribution per image
    const counts = {}
    captions?.forEach(c => { counts[c.image_id] = (counts[c.image_id] || 0) + 1 })
    const dist = { '0': 0, '1': 0, '2': 0, '3': 0, '4+': 0 }
    images?.forEach(img => {
      const n = counts[img.id] || 0
      if (n >= 4) dist['4+']++
      else dist[String(n)]++
    })
    setCaptionDist(Object.entries(dist).map(([k, v]) => ({ name: k + ' captions', count: v })))

    // User growth over time
    const monthMap = {}
    profiles?.forEach(p => {
      const m = p.created_at?.slice(0, 7) || 'unknown'
      monthMap[m] = (monthMap[m] || 0) + 1
    })
    let cum = 0
    setUserGrowth(Object.entries(monthMap).sort().map(([m, n]) => ({ month: m.slice(5) + '/' + m.slice(2, 4), total: (cum += n) })))

    // Top image uploaders
    const userImgCount = {}
    images?.forEach(img => { userImgCount[img.profile_id] = (userImgCount[img.profile_id] || 0) + 1 })
    const userMap = {}
    profiles?.forEach(p => { userMap[p.id] = p.username || p.id.slice(0, 8) })
    setTopUsers(
      Object.entries(userImgCount)
        .sort(([, a], [, b]) => b - a).slice(0, 5)
        .map(([id, n]) => ({ name: userMap[id] || id.slice(0, 8), images: n }))
    )

    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div className="spinner" /></div>

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Overview</div>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Users" value={stats.totalUsers} sub="registered profiles" color="var(--accent)" icon="◉" />
        <StatCard label="Images" value={stats.totalImages} sub="uploaded" color="var(--accent2)" icon="▣" />
        <StatCard label="Captions" value={stats.totalCaptions} sub="submitted" color="var(--accent3)" icon="≡" />
        <StatCard label="Avg Captions" value={stats.avg} sub="per image" color="#f7f76a" icon="∑" />
        <StatCard label="Superadmins" value={stats.superadmins} sub="admin users" color="var(--danger)" icon="⚡" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Caption Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={captionDist} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>User Growth</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="var(--accent3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Top Image Uploaders</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={topUsers} layout="vertical" barSize={16}>
            <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="images" fill="var(--accent2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}