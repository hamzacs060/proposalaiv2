'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -100, right: -150, position: 'absolute' }} />
      <div className="orb orb-gold"   style={{ width: 350, height: 350, bottom: -100, left: -50, position: 'absolute' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}>✦</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>ProposalAI</span>
          </Link>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Free to start. No card needed.</p>
        </div>

        <div className="glass" style={{ padding: 36 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              color: '#fca5a5', fontSize: 14,
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Full Name</label>
              <input className="input" type="text" value={fullName}
                onChange={e => setFullName(e.target.value)} placeholder="Alex Johnson" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Email address</label>
              <input className="input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label className="label">Password</label>
              <input className="input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
            </div>
            <button type="submit" className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: 15 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 20 }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
