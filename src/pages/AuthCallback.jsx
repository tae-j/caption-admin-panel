import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Parse the hash fragment manually
    const hash = window.location.hash
    if (hash) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/dashboard', { replace: true })
        } else {
          // Give it a moment to process the hash
          setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) navigate('/dashboard', { replace: true })
              else navigate('/', { replace: true })
            })
          }, 1000)
        }
      })
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 16 }}>
      <div className="spinner" />
      <div style={{ color: 'var(--text2)', fontSize: 13 }}>Signing you in...</div>
    </div>
  )
}