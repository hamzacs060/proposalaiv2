'use client'
import { useState, useEffect } from 'react'

interface Analytics {
  total: number
  sent: number
  won: number
  lost: number
  winRate: number
  totalRevenue: number
  avgBid: number
  thisMonthProposals: number
  lossReasons: Record<string, number>
  platforms: Record<string, { sent: number; won: number }>
}

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean
}) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <p style={{ color: '#71717a', fontSize: 13, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, color: accent ? 'linear-gradient(135deg,#a78bfa,#f59e0b)' : '#f4f4f5' }}>{value}</p>
      {sub && <p style={{ color: '#52525b', fontSize: 12, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

function BarRow({ label, value, max, color }: {
  label: string; value: number; max: number; color: string
}) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: '#d4d4d8', textTransform: 'capitalize' }}>{label.replace(/_/g, ' ')}</span>
        <span style={{ color: '#a1a1aa' }}>{value}</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 8 }}>
        <div style={{ background: color, borderRadius: 4, height: 6, width: `${pct}%`, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setAnalytics(d.analytics); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: '#71717a', paddingTop: 40 }}>Loading analytics...</div>
  if (!analytics) return <div style={{ color: '#71717a', paddingTop: 40 }}>No data yet.</div>

  const maxLossReason = Math.max(...Object.values(analytics.lossReasons), 1)
  const platformEntries = Object.entries(analytics.platforms)

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#f4f4f5' }}>
        Analytics
      </h1>
      <p style={{ color: '#71717a', marginBottom: 32 }}>
        Track your performance and understand what wins.
      </p>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Proposals"  value={String(analytics.total)} />
        <StatCard label="Sent"             value={String(analytics.sent)} />
        <StatCard label="Won"              value={String(analytics.won)} />
        <StatCard label="Win Rate"         value={`${analytics.winRate}%`} accent />
        <StatCard label="Total Revenue"    value={`$${analytics.totalRevenue.toLocaleString()}`} sub="from won proposals" />
        <StatCard label="Avg Bid"          value={`$${analytics.avgBid.toLocaleString()}`} />
        <StatCard label="This Month"       value={String(analytics.thisMonthProposals)} sub="proposals" />
        <StatCard label="Lost"             value={String(analytics.lost)} />
      </div>

      <div style={{
      display:'grid',
      gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))',
      gap:16
      }}>

        {/* Loss Reasons */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 600, fontSize: 16, color: '#f4f4f5', marginBottom: 20 }}>
            Why You Lost
          </h2>
          {Object.keys(analytics.lossReasons).length === 0 ? (
            <p style={{ color: '#71717a', fontSize: 14 }}>
              No losses recorded yet. Keep tracking!
            </p>
          ) : (
            Object.entries(analytics.lossReasons).map(([reason, count]) => (
              <BarRow key={reason} label={reason} value={count} max={maxLossReason} color="#ef4444" />
            ))
          )}
          {Object.keys(analytics.lossReasons).length > 0 && (
            <p style={{ color: '#52525b', fontSize: 12, marginTop: 16 }}>
              Based on {analytics.lost} tracked losses
            </p>
          )}
        </div>

        {/* Platform Breakdown */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 600, fontSize: 16, color: '#f4f4f5', marginBottom: 20 }}>
            Best Platforms
          </h2>
          {platformEntries.length === 0 ? (
            <p style={{ color: '#71717a', fontSize: 14 }}>
              No platform data yet.
            </p>
          ) : (
            platformEntries.map(([platform, stats]) => {
              const rate = stats.sent > 0 ? Math.round((stats.won / stats.sent) * 100) : 0
              return (
                <div key={platform} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#d4d4d8', fontSize: 14 }}>{platform}</span>
                    <span style={{ color: '#a78bfa', fontSize: 14, fontWeight: 600 }}>{rate}% win rate</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 6 }}>
                    <div style={{
                      background: '#a78bfa', borderRadius: 4, height: 6,
                      width: `${rate}%`, transition: 'width 0.5s'
                    }} />
                  </div>
                  <p style={{ color: '#52525b', fontSize: 12, marginTop: 4 }}>
                    {stats.won} won / {stats.sent} sent
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Insight box */}
      {analytics.total < 5 && (
        <div className="card" style={{ padding: 20, marginTop: 16, border: '1px solid rgba(99,102,241,0.3)',
          background: 'rgba(99,102,241,0.08)' }}>
          <p style={{ color: '#818cf8', fontSize: 14 }}>
            💡 <strong>Tip:</strong> Create and track at least 10 proposals to start seeing meaningful patterns.
            Mark each proposal as Sent, Won, or Lost to power your analytics.
          </p>
        </div>
      )}
    </div>
  )
}
