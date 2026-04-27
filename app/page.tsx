import Link from 'next/link'

const FEATURES = [
  { icon: '✍️', title: 'Human-Quality Proposals', desc: 'Not generic AI output. Each proposal is written specifically for that job — referencing real details, showing real expertise.' },
  { icon: '💰', title: 'Smart Pricing Engine', desc: 'Never underprice or overbid again. Get a line-item breakdown with the reasoning behind every number.' },
  { icon: '📋', title: 'Scope of Work', desc: 'Protect yourself legally. Clear deliverables, milestones, and what is explicitly NOT included.' },
  { icon: '📧', title: 'Follow-Up Email', desc: 'The money is in the follow-up. Get a specific, smart email that forces a reply — not "just checking in."' },
  { icon: '🎯', title: 'Win Probability Score', desc: 'Honest assessment of how strong your proposal is before you hit send. Know your odds going in.' },
  { icon: '📊', title: 'Win/Loss Analytics', desc: 'Track every proposal. See which platforms convert, why you lose, and what your win rate actually is.' },
]

const STEPS = [
  { num: '01', title: 'Paste the job post', desc: 'Copy any job from Upwork, Fiverr, or a client email. Paste it in.' },
  { num: '02', title: 'AI builds your package', desc: 'Get proposal, pricing, scope, and follow-up — all specific to that job.' },
  { num: '03', title: 'Send and track results', desc: 'Mark won or lost. Build your data. Watch your win rate climb.' },
]

const STATS = [
  { value: '30s', label: 'To generate a proposal' },
  { value: '3×', label: 'More proposals per day' },
  { value: '40%', label: 'Average win rate improvement' },
  { value: '$0', label: 'To get started' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* ── GRID BACKGROUND ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* ── ORB DECORATIONS ── */}
      <div className="orb orb-purple animate-float" style={{
        width: 600, height: 600, top: -200, left: -200, opacity: 0.6,
        position: 'fixed', zIndex: 0,
      }} />
      <div className="orb orb-gold" style={{
        width: 400, height: 400, top: 100, right: -100, opacity: 0.5,
        position: 'fixed', zIndex: 0,
        animation: 'float 6s 2s ease-in-out infinite',
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(6,6,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 0 20px rgba(124,58,237,0.5)',
          }}>✦</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>
            ProposalAI
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">Sign in</button>
          </Link>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">Start Free →</button>
          </Link>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ textAlign: 'center', padding: '120px 24px 80px', maxWidth: 900, margin: '0 auto' }}>

          <div className="animate-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 40, padding: '7px 18px', marginBottom: 32,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a855f7',
              boxShadow: '0 0 8px #a855f7', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: '#c084fc', fontWeight: 500 }}>
              Powered by Llama 3.3 · Free to start
            </span>
          </div>

          <h1 className="animate-fade-up-1" style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(44px, 7vw, 88px)',
            lineHeight: 1.05, marginBottom: 28, letterSpacing: '-0.03em',
          }}>
            Stop losing jobs<br />
            <span className="gradient-text">to better writers.</span>
          </h1>

          <p className="animate-fade-up-2" style={{
            fontSize: 20, color: 'var(--text2)', maxWidth: 560, margin: '0 auto 48px',
            lineHeight: 1.7, fontWeight: 300,
          }}>
            Paste a job post. Get a complete, personalized proposal package in{' '}
            <strong style={{ color: 'var(--text)', fontWeight: 600 }}>30 seconds.</strong>{' '}
            Track what wins. Win more.
          </p>

          <div className="animate-fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                Generate Your First Proposal →
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ fontSize: 16, padding: '14px 24px' }}>
                Sign in
              </button>
            </Link>
          </div>

          <p className="animate-fade-up-4" style={{ color: 'var(--text3)', marginTop: 20, fontSize: 13 }}>
            Free to use. No credit card required.
          </p>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{
          maxWidth: 900, margin: '0 auto 80px', padding: '0 24px',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: 20, overflow: 'hidden',
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: '28px 24px', textAlign: 'center',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: 36, color: 'var(--text)',
                  background: 'linear-gradient(135deg, #a78bfa, #f59e0b)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {s.value}
                </div>
                <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: 1000, margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--accent2)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              How it works
            </p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800 }}>
              Three steps. Thirty seconds.
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {STEPS.map((step, i) => (
              <div key={step.num} className="card" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: -20, right: -10,
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 80,
                  color: 'rgba(124,58,237,0.08)', lineHeight: 1, userSelect: 'none',
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, marginBottom: 20,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.15))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#a78bfa', fontSize: 16, fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: 1000, margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              What you get
            </p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800 }}>
              Your entire proposal system
            </h2>
          </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 16
                }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card" style={{
                padding: 28, display: 'flex', gap: 18,
                transition: 'transform 0.2s, border-color 0.2s',
                animation: `fadeUp 0.5s ${i * 0.08}s ease both`,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
          <div style={{
            maxWidth: 640, margin: '0 auto',
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 24, padding: '60px 40px',
            boxShadow: '0 0 80px rgba(124,58,237,0.15)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(124,58,237,0.2)', filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
              Start winning more clients
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 36, lineHeight: 1.6, position: 'relative' }}>
              Free to start. Takes 2 minutes. Your first proposal in 30 seconds.
            </p>
            <Link href="/signup" style={{ textDecoration: 'none', position: 'relative' }}>
              <button className="btn-primary" style={{ fontSize: 17, padding: '15px 36px' }}>
                Create Free Account →
              </button>
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '28px 48px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
            }}>✦</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>ProposalAI</span>
          </div>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>
            © 2026 ProposalAI. Built for freelancers.
          </p>
        </footer>
      </div>
    </div>
  )
}
