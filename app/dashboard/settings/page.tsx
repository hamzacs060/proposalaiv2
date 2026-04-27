'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const FREELANCER_TYPES = [
  'Developer', 'Designer', 'Writer', 'Marketer',
  'Video Editor', 'Consultant', 'Virtual Assistant', 'Other',
]

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    full_name:       '',
    freelancer_type: 'Developer',
    hourly_rate:     75,
    bio:             '',
    skills:          '',
  })
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('profiles').select('*').single().then(({ data }) => {
      if (data) {
        setProfile({
          full_name:       data.full_name       || '',
          freelancer_type: data.freelancer_type || 'Developer',
          hourly_rate:     data.hourly_rate     || 75,
          bio:             data.bio             || '',
          skills:          (data.skills || []).join(', '),
        })
      }
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      full_name:       profile.full_name,
      freelancer_type: profile.freelancer_type,
      hourly_rate:     Number(profile.hourly_rate),
      bio:             profile.bio,
      skills:          profile.skills.split(',').map(s => s.trim()).filter(Boolean),
      updated_at:      new Date().toISOString(),
    }).eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div style={{ color: '#71717a' }}>Loading settings...</div>

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#f4f4f5' }}>Settings</h1>
      <p style={{ color: '#71717a', marginBottom: 32, lineHeight: 1.6 }}>
        Your profile is used by the AI to personalize proposals. The more detail you add,
        the better your proposals will match your voice and experience.
      </p>

      <div className="card" style={{ padding: 22 }}>
        {/* Name */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#a1a1aa', fontWeight: 500 }}>
            Full Name
          </label>
          <input
            className="input"
            type="text"
            value={profile.full_name}
            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Alex Johnson"
          />
        </div>

        {/* Type + Rate */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))',
          gap:16,
          marginBottom:20
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#a1a1aa', fontWeight: 500 }}>
              Freelancer Type
            </label>
            <select
              className="input"
              value={profile.freelancer_type}
              onChange={e => setProfile({ ...profile, freelancer_type: e.target.value })}
            >
              {FREELANCER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#a1a1aa', fontWeight: 500 }}>
              Typical Hourly Rate ($)
            </label>
            <input
              className="input"
              type="number"
              value={profile.hourly_rate}
              onChange={e => setProfile({ ...profile, hourly_rate: Number(e.target.value) })}
              placeholder="75"
              min={1}
            />
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#a1a1aa', fontWeight: 500 }}>
            Your Skills <span style={{ color: '#52525b' }}>(comma-separated)</span>
          </label>
          <input
            className="input"
            type="text"
            value={profile.skills}
            onChange={e => setProfile({ ...profile, skills: e.target.value })}
            placeholder="React, TypeScript, Node.js, PostgreSQL, AWS"
          />
          <p style={{ color: '#52525b', fontSize: 12, marginTop: 6 }}>
            These help the AI match your skills to job requirements.
          </p>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#a1a1aa', fontWeight: 500 }}>
            About You <span style={{ color: '#52525b' }}>(the AI writes in your voice based on this)</span>
          </label>
          <textarea
            className="input"
            rows={5}
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            placeholder="I'm a React developer with 5 years of experience building SaaS products. I've worked with startups and Fortune 500 companies. I'm known for clean code, clear communication, and delivering on time. I specialize in performance-critical dashboards and data visualization."
            style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <p style={{ color: '#52525b', fontSize: 12, marginTop: 6 }}>
            Write 2–4 sentences about yourself. Include your experience, specialty, and what you&apos;re known for.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{
          padding:'16px 18px',
          fontSize:16,
          width:'100%'
        }}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: 20, marginTop: 16,
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <p style={{ color: '#818cf8', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
          💡 Tips for better proposals
        </p>
        <ul style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 2, paddingLeft: 20 }}>
          <li>Mention specific industries you&apos;ve worked in (e.g. fintech, e-commerce)</li>
          <li>Include notable results (e.g. &quot;reduced load time by 60%&quot;)</li>
          <li>Add your communication style (e.g. &quot;I send daily updates&quot;)</li>
          <li>List tools and frameworks you use</li>
        </ul>
      </div>
    </div>
  )
}
