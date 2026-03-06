import { useAuth } from '../components/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle, authError, session } = useAuth()

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.25
      }} />
      <div style={{
        position: 'relative', background: 'var(--bg2)',
        border: '1px solid var(--border)', borderRadius: 20,
        padding: '48px 40px', width: 360, textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: 56, height: 56,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          borderRadius: 14, display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 20px', fontSize: 28
        }}>⚡</div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Restricted Access
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Crackd Admin</h1>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 32, lineHeight: 1.6 }}>
          Sign in with your Google account. Only superadmins may enter.
        </p>

        {authError && (
          <div style={{
            background: 'rgba(247,106,106,0.1)', border: '1px solid var(--danger)',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: 'var(--danger)', marginBottom: 20, textAlign: 'left'
          }}>
            ⚠️ {authError}
            {session && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text2)' }}>Signed in as: {session.user.email}</div>}
          </div>
        )}

        <button className="btn btn-primary" onClick={signInWithGoogle}
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}>
          Continue with Google
        </button>

        <div style={{ marginTop: 20, padding: '10px', background: 'var(--bg3)', borderRadius: 8, fontSize: 11, color: 'var(--text2)' }}>
          🔒 Requires <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>is_superadmin = true</code>
        </div>
      </div>
    </div>
  )
}