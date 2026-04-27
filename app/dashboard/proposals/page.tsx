'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Proposal {
  id: string
  client_name: string | null
  platform: string | null
  status: string
  bid_amount: number | null
  win_probability: number | null
  created_at: string
  job_post: string
  loss_reason: string | null
}

const STATUS_OPTIONS = ['all', 'draft', 'sent', 'won', 'lost']

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft:    { bg: 'rgba(113,113,122,0.2)', text: '#a1a1aa' },
  sent:     { bg: 'rgba(59,130,246,0.2)',  text: '#93c5fd' },
  won:      { bg: 'rgba(34,197,94,0.2)',   text: '#86efac' },
  lost:     { bg: 'rgba(239,68,68,0.2)',   text: '#fca5a5' },
  archived: { bg: 'rgba(113,113,122,0.2)', text: '#71717a' },
}

const LOSS_REASONS = ['price', 'skills_mismatch', 'no_response', 'timing', 'other']

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState<string | null>(null)

  const loadProposals = useCallback(async (status: string) => {
    setLoading(true)
    const url = status === 'all' ? '/api/proposals' : `/api/proposals?status=${status}`
    const res = await fetch(url)
    const data = await res.json()
    setProposals(data.proposals || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadProposals(filter) }, [filter, loadProposals])

  async function updateStatus(id: string, status: string, lossReason?: string) {
    setMarkingId(id)
    await fetch('/api/proposals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, loss_reason: lossReason }),
    })
    loadProposals(filter)
    setMarkingId(null)
  }

  async function handleMarkLost(id: string) {
    const reason = window.prompt(
      `Why did you lose this proposal?\n\nType one of:\n${LOSS_REASONS.join(', ')}`
    )
    if (reason !== null) {
      await updateStatus(id, 'lost', reason || 'other')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#f4f4f5' }}>
            My Proposals
          </h1>
          <p style={{ color: '#71717a' }}>{proposals.length} proposals</p>
        </div>
        <Link href="/dashboard/proposals/new">
          <button className="btn-primary">✨ New Proposal</button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: filter === s ? 600 : 400, textTransform: 'capitalize',
              background: filter === s ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
              color: filter === s ? '#818cf8' : '#71717a',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#71717a' }}>Loading...</div>
      ) : proposals.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#71717a', marginBottom: 20, fontSize: 16 }}>
            {filter === 'all' ? 'No proposals yet.' : `No ${filter} proposals.`}
          </p>
          <Link href="/dashboard/proposals/new">
            <button className="btn-primary">✨ Create First Proposal</button>
          </Link>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {proposals.map((p, i) => {
            const st = STATUS_COLORS[p.status] || STATUS_COLORS.draft
            const isMarking = markingId === p.id
            const preview = p.job_post ? p.job_post.substring(0, 120) + '...' : ''

            return (
              <div key={p.id} style={{
                padding: '20px 24px',
                borderBottom: i < proposals.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#f4f4f5' }}>
                        {p.client_name || 'Unnamed Client'}
                      </span>
                      {p.platform && (
                        <span style={{ color: '#52525b', fontSize: 13 }}>· {p.platform}</span>
                      )}
                      <span style={{
                        background: st.bg, color: st.text,
                        padding: '2px 10px', borderRadius: 20, fontSize: 11,
                        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {p.status}
                      </span>
                      {p.loss_reason && (
                        <span style={{ color: '#71717a', fontSize: 12 }}>
                          · {p.loss_reason}
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#71717a', fontSize: 13, marginBottom: 6 }}>
                      {new Date(p.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                      {p.bid_amount ? ` · $${p.bid_amount.toLocaleString()}` : ''}
                      {p.win_probability != null ? ` · ${p.win_probability}% win chance` : ''}
                    </p>
                    <p style={{ color: '#52525b', fontSize: 12, lineHeight: 1.4 }}>{preview}</p>
                  </div>

                  {(p.status === 'draft' || p.status === 'sent') && (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {p.status === 'draft' && (
                        <button
                          onClick={() => updateStatus(p.id, 'sent')}
                          disabled={isMarking}
                          className="btn-secondary"
                          style={{ fontSize: 12, padding: '6px 10px',
                            background: 'rgba(59,130,246,0.1)', color: '#93c5fd',
                            borderColor: 'rgba(59,130,246,0.2)' }}
                        >
                          📤 Sent
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(p.id, 'won')}
                        disabled={isMarking}
                        className="btn-secondary"
                        style={{ fontSize: 12, padding: '6px 10px',
                          background: 'rgba(34,197,94,0.1)', color: '#86efac',
                          borderColor: 'rgba(34,197,94,0.2)' }}
                      >
                        Won ✓
                      </button>
                      <button
                        onClick={() => handleMarkLost(p.id)}
                        disabled={isMarking}
                        className="btn-secondary"
                        style={{ fontSize: 12, padding: '6px 10px',
                          background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
                          borderColor: 'rgba(239,68,68,0.2)' }}
                      >
                        Lost ✗
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
