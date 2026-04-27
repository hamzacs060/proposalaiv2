'use client'
import { useState } from 'react'

const PLATFORMS = ['Upwork', 'Fiverr', 'Toptal', 'Freelancer.com', 'Direct', 'LinkedIn', 'Other']

interface GeneratedOutput {
  proposal: { subject_line: string; full_text: string }
  pricing: { suggested_rate: number; rate_type: string; breakdown: { item: string; cost: number }[]; total: number; reasoning: string }
  scope: { deliverables: string[]; timeline: string; milestones: { name: string; deliverable: string; duration: string }[]; exclusions: string[] }
  follow_up: { subject: string; body: string; send_after_days: number }
  win_probability: number
  win_probability_reasoning: string
}

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button className="btn-secondary" style={{ fontSize: 12, padding: '5px 14px' }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
      {copied ? '✓ Copied!' : label}
    </button>
  )
}

function Block({ title, children, copyText }: { title: string; children: React.ReactNode; copyText?: string }) {
  return (
    <div className="card" style={{ padding: 28, marginBottom: 16, animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{title}</h3>
        {copyText && <CopyBtn text={copyText} />}
      </div>
      {children}
    </div>
  )
}

export default function NewProposalPage() {
  const [jobPost, setJobPost]       = useState('')
  const [clientName, setClientName] = useState('')
  const [platform, setPlatform]     = useState('Upwork')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [output, setOutput]         = useState<GeneratedOutput | null>(null)
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [statusMsg, setStatusMsg]   = useState('')

  async function handleGenerate() {
    if (jobPost.trim().length < 50) { setError('Paste the full job description (min 50 characters)'); return }
    setLoading(true); setError(''); setOutput(null); setStatusMsg('')
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobPost, clientName, platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setOutput(data.generated)
      setProposalId(data.proposal.id)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally { setLoading(false) }
  }

  async function markStatus(status: string, lossReason?: string) {
    if (!proposalId) return
    await fetch('/api/proposals', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: proposalId, status, loss_reason: lossReason }),
    })
    setStatusMsg(status === 'won' ? '🎉 Marked as Won!' : status === 'sent' ? '📤 Marked as Sent!' : '📝 Updated!')
    setTimeout(() => setStatusMsg(''), 3000)
  }

  const wp = output?.win_probability || 0
  const wpColor = wp >= 70 ? '#10b981' : wp >= 50 ? '#f59e0b' : '#ef4444'
  const wpLabel = wp >= 70 ? 'Strong' : wp >= 50 ? 'Moderate' : 'Challenging'

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div className="animate-fade-up" style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>✦ Generate Proposal</h1>
        <p style={{ color: 'var(--text2)' }}>
          Paste any job post below. Get a complete winning package in ~15 seconds.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="card animate-fade-up-1" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label className="label">Job Post / Description *</label>
          <textarea className="input" rows={9} value={jobPost}
            onChange={e => setJobPost(e.target.value)}
            placeholder="Paste the full job description here. The more detail you give, the better and more specific the proposal will be. Include their requirements, goals, budget hints, timeline..."
            style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <p style={{ color: 'var(--text3)', fontSize: 12 }}>
              {jobPost.length} characters {jobPost.length < 50 && '— need at least 50'}
            </p>
            {jobPost.length >= 50 && (
              <p style={{ color: '#10b981', fontSize: 12 }}>✓ Ready to generate</p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label className="label">Client Name (optional)</label>
            <input className="input" type="text" value={clientName}
              onChange={e => setClientName(e.target.value)} placeholder="Sarah Johnson" />
          </div>
          <div>
            <label className="label">Platform</label>
            <select className="input" value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
            color: '#fca5a5', fontSize: 14,
          }}>⚠ {error}</div>
        )}

        <button className="btn-primary" onClick={handleGenerate} disabled={loading}
          style={{ width: '100%', padding: '14px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? (
            <>
              <span style={{ animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>✦</span>
              Generating your proposal package...
            </>
          ) : (
            <><span>✦</span> Generate Complete Proposal Package</>
          )}
        </button>

        {loading && (
          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, marginTop: 12 }}>
            Reading the job post · Crafting personalized content · Building pricing breakdown...
          </p>
        )}
      </div>

      {/* OUTPUT */}
      {output && (
        <div>
          {/* STATUS BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 22 }}>Your Proposal Package</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {statusMsg && <span style={{ color: '#10b981', fontSize: 14, fontWeight: 600 }}>{statusMsg}</span>}
              <button className="btn-secondary"
                style={{ fontSize: 12, padding: '7px 12px', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', borderColor: 'rgba(59,130,246,0.2)' }}
                onClick={() => markStatus('sent')}>📤 Mark Sent</button>
              <button className="btn-secondary"
                style={{ fontSize: 12, padding: '7px 12px', background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', borderColor: 'rgba(16,185,129,0.2)' }}
                onClick={() => markStatus('won')}>✓ Mark Won</button>
              <button className="btn-secondary"
                style={{ fontSize: 12, padding: '7px 12px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.2)' }}
                onClick={() => markStatus('lost', 'other')}>✗ Mark Lost</button>
            </div>
          </div>

          {/* WIN PROBABILITY */}
          <div className="card-glow" style={{ padding: 28, marginBottom: 16, animation: 'fadeUp 0.3s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Win Probability</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13 }}>{wpLabel} chance of winning this job</p>
              </div>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 800, color: wpColor,
                textShadow: `0 0 30px ${wpColor}`,
              }}>
                {wp}%
              </div>
            </div>
            {/* Bar */}
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 8, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 6, width: `${wp}%`,
                background: `linear-gradient(90deg, ${wpColor}88, ${wpColor})`,
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 0 12px ${wpColor}`,
              }} />
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>
              {output.win_probability_reasoning}
            </p>
          </div>

          {/* PROPOSAL TEXT */}
          <Block title="📝 Proposal"
            copyText={`Subject: ${output.proposal.subject_line}\n\n${output.proposal.full_text}`}>
            <div style={{
              background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: 10, padding: '14px 18px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ color: 'var(--text3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Subject line</p>
                <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14 }}>{output.proposal.subject_line}</p>
              </div>
              <CopyBtn text={output.proposal.subject_line} label="Copy subject" />
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '20px 22px',
              fontSize: 14, lineHeight: 1.9, color: '#d0d0e8',
              whiteSpace: 'pre-wrap', fontFamily: 'DM Sans, sans-serif',
              border: '1px solid var(--border)',
            }}>
              {output.proposal.full_text}
            </div>
          </Block>

          {/* PRICING */}
          <Block title="💰 Pricing Breakdown"
            copyText={`Pricing: $${output.pricing.total} (${output.pricing.rate_type})\n\n` +
              output.pricing.breakdown.map(b => `${b.item}: $${b.cost}`).join('\n') +
              `\n\nTotal: $${output.pricing.total}\n\n${output.pricing.reasoning}`}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontSize: 44, fontWeight: 800, color: 'var(--text)',
                background: 'linear-gradient(135deg, #a78bfa, #f59e0b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                ${output.pricing.total.toLocaleString()}
              </span>
              <span style={{ color: 'var(--text3)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {output.pricing.rate_type}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              {output.pricing.breakdown.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', fontSize: 14,
                  borderBottom: i < output.pricing.breakdown.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ color: 'var(--text2)' }}>{item.item}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
                    ${item.cost.toLocaleString()}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, marginTop: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>Total</span>
                <span style={{ fontWeight: 800, color: '#a78bfa', fontSize: 17, fontFamily: 'Syne, sans-serif' }}>
                  ${output.pricing.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 8,
              background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)',
              color: 'var(--text2)', fontSize: 13, lineHeight: 1.6,
            }}>
              💡 {output.pricing.reasoning}
            </div>
          </Block>

          {/* SCOPE */}
          <Block title="📋 Scope of Work"
            copyText={`DELIVERABLES:\n${output.scope.deliverables.map(d => `• ${d}`).join('\n')}\n\nTIMELINE: ${output.scope.timeline}\n\nMILESTONES:\n${output.scope.milestones.map(m => `${m.name} (${m.duration}): ${m.deliverable}`).join('\n')}\n\nNOT INCLUDED:\n${output.scope.exclusions.map(e => `• ${e}`).join('\n')}`}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <p style={{ color: 'var(--text3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Deliverables
                </p>
                {output.scope.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: 'var(--text2)', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ color: 'var(--text3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Not Included
                </p>
                {output.scope.exclusions.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--text3)', flexShrink: 0 }}>✗</span>
                    <span style={{ color: 'var(--text3)', lineHeight: 1.5 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 20, border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Timeline & Milestones
              </p>
              {output.scope.milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 13, alignItems: 'flex-start' }}>
                  <span style={{
                    color: '#a78bfa', fontWeight: 600, minWidth: 85, fontSize: 12,
                    background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 6,
                    textAlign: 'center', flexShrink: 0,
                  }}>{m.duration}</span>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{m.name}</p>
                    <p style={{ color: 'var(--text2)' }}>{m.deliverable}</p>
                  </div>
                </div>
              ))}
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', color: 'var(--text2)', fontSize: 13 }}>
                📅 Total: <strong style={{ color: 'var(--text)' }}>{output.scope.timeline}</strong>
              </div>
            </div>
          </Block>

          {/* FOLLOW-UP */}
          <Block title={`📧 Follow-Up Email — Send in ${output.follow_up.send_after_days} days`}
            copyText={`Subject: ${output.follow_up.subject}\n\n${output.follow_up.body}`}>
            <div style={{
              background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 10, padding: '14px 18px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ color: 'var(--text3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Subject</p>
                <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14 }}>{output.follow_up.subject}</p>
              </div>
              <CopyBtn text={output.follow_up.subject} label="Copy" />
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '20px 22px',
              fontSize: 14, lineHeight: 1.9, color: '#d0d0e8',
              whiteSpace: 'pre-wrap', fontFamily: 'DM Sans, sans-serif',
              border: '1px solid var(--border)',
            }}>
              {output.follow_up.body}
            </div>
            <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 12 }}>
              💡 Set a reminder to send this {output.follow_up.send_after_days} days after your initial proposal.
            </p>
          </Block>

          <div style={{ textAlign: 'center', paddingBottom: 60 }}>
            <button className="btn-secondary"
              onClick={() => { setOutput(null); setProposalId(null) }}
              style={{ marginRight: 12 }}>
              ← Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
