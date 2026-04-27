'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard',               icon: '⬡', label: 'Dashboard' },
  { href: '/dashboard/proposals/new', icon: '✦', label: 'New Proposal' },
  { href: '/dashboard/proposals',     icon: '◈', label: 'My Proposals' },
  { href: '/dashboard/analytics',     icon: '◎', label: 'Analytics' },
  { href: '/dashboard/settings',      icon: '◐', label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [initials, setInitials] = useState('?')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('profiles').select('full_name').single().then(({ data }) => {
      if (data?.full_name) {
        setUserName(data.full_name)
        const parts = data.full_name.split(' ')
        setInitials(parts.map((p: string) => p[0]).join('').substring(0, 2).toUpperCase())
      }
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 230, background: 'rgba(12,12,26,0.95)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 50,
        backdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}>✦</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text)' }}>
              ProposalAI
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {/* New Proposal — highlighted */}
          <Link href="/dashboard/proposals/new" style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
            <div style={{
              padding: '11px 14px', borderRadius: 10,
              background: pathname === '/dashboard/proposals/new'
                ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.25))'
                : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#c084fc',
              display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 0 20px rgba(124,58,237,0.15)',
              transition: 'all 0.2s',
            }}>
              <span>✦</span>
              <span>New Proposal</span>
            </div>
          </Link>

          <div className="divider" style={{ margin: '12px 0' }} />

          {NAV.filter(n => n.href !== '/dashboard/proposals/new').map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  color: active ? '#a78bfa' : 'var(--text2)',
                  fontWeight: active ? 600 : 400, fontSize: 14,
                  borderLeft: active ? '2px solid #7c3aed' : '2px solid transparent',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12, color: 'white',
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName || 'Freelancer'}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text3)' }}>Free plan</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary"
            style={{ width: '100%', fontSize: 13, padding: '9px' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 230, flex: 1, padding: '36px 40px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
