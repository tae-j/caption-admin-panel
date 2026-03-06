import { NavLink } from 'react-router-dom'
import { useAuth } from './AuthContext'

const navItems = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/users', icon: '◉', label: 'Users' },
  { to: '/images', icon: '▣', label: 'Images' },
  { to: '/captions', icon: '≡', label: 'Captions' },
]

export default function Layout({ children }) {
  const { profile, signOut } = useAuth()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{
        width: 220, background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18
            }}>⚡</div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>ADMIN</div>
              <div style={{ fontSize: 10, color: 'var(--text2)' }}>Crackd Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              color: isActive ? 'var(--accent)' : 'var(--text2)',
              background: isActive ? 'rgba(124,106,247,0.12)' : 'transparent',
              fontWeight: isActive ? 500 : 400, fontSize: 14,
              transition: 'all 0.15s', textDecoration: 'none',
            })}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0
            }}>
              {profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile?.username || 'Admin'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>superadmin</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={signOut}
            style={{ width: '100%', justifyContent: 'center' }}>
            Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)', padding: '28px 32px' }}>
        {children}
      </main>
    </div>
  )
}