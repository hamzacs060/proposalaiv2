'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Proposal {
  id: string; client_name: string | null; platform: string | null
  status: string; bid_amount: number | null; win_probability: number | null; created_at: string
}
interface Analytics {
  total: number; winRate: number; avgBid: number; thisMonthProposals: number; totalRevenue: number
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  draft:    { bg: 'rgba(113,113,154,0.15)', color: '#9898b8' },
  sent:     { bg: 'rgba(59,130,246,0.15)',  color: '#93c5fd' },
  won:      { bg: 'rgba(16,185,129,0.15)',  color: '#6ee7b7' },
  lost:     { bg: 'rgba(239,68,68,0.15)',   color: '#fca5a5' },
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string; icon: string; accent?: string
}) {
  return (
    <div className="card" style={{
      padding: '18px 18px',
      background: 'rgba(255,255,255,0.025)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -10,
        fontSize: 50, opacity: 0.06, userSelect: 'none',
      }}>{icon}</div>
      <p style={{ color: 'var(--text3)', fontSize: 12, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800,
        color: accent || 'var(--text)', lineHeight: 1,
      }}>
        {value}
      </p>
      {sub && <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 8 }}>{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/proposals?limit=6').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
    ]).then(([p, a]) => {
      setProposals(p.proposals || [])
      setAnalytics(a.analytics || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>✦</div>
        <p style={{ color: 'var(--text3)' }}>Loading your dashboard...</p>
      </div>
    </div>
  )

  const winRateColor = (analytics?.winRate || 0) >= 50 ? '#10b981' : (analytics?.winRate || 0) >= 30 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      {/* HEADER */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12, marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Dashboard</h1>
          <p style={{ color: 'var(--text2)' }}>Track your proposals and grow your win rate</p>
        </div>
        <Link href="/dashboard/proposals/new" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>✦</span> New Proposal
          </button>
        </Link>
      </div>

      {/* STATS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        <StatCard icon="📄" label="Total Proposals" value={String(analytics?.total || 0)} sub="all time" />
        <StatCard icon="🎯" label="Win Rate"        value={`${analytics?.winRate || 0}%`} sub="of sent proposals" accent={winRateColor} />
        <StatCard icon="💰" label="Revenue Won"     value={`$${(analytics?.totalRevenue || 0).toLocaleString()}`} sub="from won proposals" accent="#f59e0b" />
        <StatCard icon="📅" label="This Month"      value={String(analytics?.thisMonthProposals || 0)} sub="proposals created" />
      </div>

      {/* RECENT PROPOSALS */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid var(--border)',
          display:'flex',
          flexDirection:'column',
          alignItems:'flex-start',
          gap:8,
          }}>
          <h2 style={{ fontWeight: 700, fontSize: 17 }}>Recent Proposals</h2>
          <Link href="/dashboard/proposals" style={{ color: 'var(--accent2)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            View all →
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
            }}>✦</div>
            <h3 style={{ fontWeight: 700, marginBottom: 10 }}>No proposals yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14 }}>
              Generate your first proposal and start winning clients.
            </p>
            <Link href="/dashboard/proposals/new" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">✦ Generate First Proposal</button>
            </Link>
          </div>
        ) : (
          proposals.map((p, i) => {
            const st = STATUS_STYLE[p.status] || STATUS_STYLE.draft
            return (
              <div key={p.id} style={{
                padding: '18px 28px',
                borderBottom: i < proposals.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {p.client_name || 'Unnamed Client'}
                    </span>
                    {p.platform && (
                      <span style={{ color: 'var(--text3)', fontSize: 13 }}>· {p.platform}</span>
                    )}
                    <span style={{
                      ...st, padding: '2px 10px', borderRadius: 20,
                      fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                    }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text3)', fontSize: 13 }}>
                    {new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {p.bid_amount ? ` · $${p.bid_amount.toLocaleString()}` : ''}
                    {p.win_probability != null ? ` · ${p.win_probability}% win chance` : ''}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* TIP CARD */}
      {(analytics?.total || 0) < 5 && (
        <div style={{
          marginTop: 20, padding: '18px 24px', borderRadius: 12,
          background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <p style={{ color: '#fbbf24', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              Complete your profile first
            </p>
            <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6 }}>
              The AI uses your profile to personalize proposals. Go to{' '}
              <Link href="/dashboard/settings" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>
                Settings
              </Link>{' '}
              and fill in your skills, rate, and bio for much better output.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
