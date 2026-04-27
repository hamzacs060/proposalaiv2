import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export interface GeneratedProposal {
  proposal: { subject_line: string; full_text: string }
  pricing: {
    suggested_rate: number
    rate_type: 'fixed' | 'hourly'
    breakdown: { item: string; cost: number }[]
    total: number
    reasoning: string
  }
  scope: {
    deliverables: string[]
    timeline: string
    milestones: { name: string; deliverable: string; duration: string }[]
    exclusions: string[]
  }
  follow_up: { subject: string; body: string; send_after_days: number }
  win_probability: number
  win_probability_reasoning: string
}

export interface FreelancerProfile {
  name?: string
  freelancerType?: string
  skills?: string[]
  hourlyRate?: number
  bio?: string
}

export async function generateProposal(
  jobPost: string,
  profile: FreelancerProfile
): Promise<GeneratedProposal> {

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 4096,
    temperature: 0.75,
    messages: [
      {
        role: 'system',
        content: `You are a world-class freelance proposal writer who has helped freelancers win over $10M in contracts.

CORE RULES — follow every single one:
1. NEVER start the proposal with "I" — start with the client's problem or a powerful hook
2. NEVER use generic phrases like "I understand that", "I am confident", "I would love to", "Looking forward to"
3. NEVER restate what the client already wrote — add insight they didn't think of
4. ALWAYS write as if the freelancer is an expert in EXACTLY what the job requires
5. ALWAYS include one specific, smart observation about their project that shows deep expertise
6. The proposal must sound like a human expert wrote it — not AI, not a template
7. End with ONE clear, specific call to action — not vague like "let me know"
8. The follow-up email must ask ONE specific question that forces a reply
9. Return ONLY raw JSON — zero markdown, zero backticks, zero explanation`,
      },
      {
        role: 'user',
        content: `Create a complete, winning proposal package for this job.

═══════════ JOB POST ═══════════
${jobPost}

═══════════ FREELANCER ═══════════
Name: ${profile.name || 'Alex'}
Type: ${profile.freelancerType || 'Freelancer'}
Skills: ${profile.skills?.join(', ') || 'Professional services'}
Rate: $${profile.hourlyRate || 75}/hr
Background: ${profile.bio || 'Experienced professional with strong track record'}

═══════════ PROPOSAL WRITING RULES ═══════════
Paragraph 1 (Hook): Open with a sharp, specific insight about THEIR project — something they haven't thought of, or the real problem behind what they asked for. DO NOT start with "I".
Paragraph 2 (Approach): Describe your specific method/process for THIS job. Be concrete. Name actual tools, techniques, or frameworks relevant to their work.
Paragraph 3 (Proof): One specific, relevant past result or skill that directly matches what they need. Be specific — avoid "I have experience in X."
Paragraph 4 (Working together): What it actually looks like to work with you. Communication style, update frequency, revision process.
Paragraph 5 (CTA): ONE specific next step. Not "let me know" — something like "Does a 15-minute call on Thursday work?" or "Can you share your brand guidelines so I can start with something concrete?"

Return ONLY this JSON with no extra text:
{
  "proposal": {
    "subject_line": "specific subject line that references their actual project details — not generic",
    "full_text": "5 paragraphs following the rules above. Each paragraph 2-4 sentences. Total 200-280 words. Professional, direct, human."
  },
  "pricing": {
    "suggested_rate": 0,
    "rate_type": "fixed",
    "breakdown": [
      {"item": "Phase name relevant to THIS job", "cost": 0},
      {"item": "Phase name relevant to THIS job", "cost": 0},
      {"item": "Phase name relevant to THIS job", "cost": 0},
      {"item": "Phase name relevant to THIS job", "cost": 0}
    ],
    "total": 0,
    "reasoning": "2 sentences explaining why this price is right for this specific scope — reference their timeline and deliverables"
  },
  "scope": {
    "deliverables": ["specific deliverable 1", "specific deliverable 2", "specific deliverable 3", "specific deliverable 4"],
    "timeline": "X business days",
    "milestones": [
      {"name": "Phase 1 name", "deliverable": "specific output", "duration": "Day 1-2"},
      {"name": "Phase 2 name", "deliverable": "specific output", "duration": "Days 3-7"},
      {"name": "Phase 3 name", "deliverable": "specific output", "duration": "Days 8-10"}
    ],
    "exclusions": ["specific thing NOT included 1", "specific thing NOT included 2", "specific thing NOT included 3"]
  },
  "follow_up": {
    "subject": "subject line that references their project specifically",
    "body": "3 sentences max. Sentence 1: reference something specific from their job post. Sentence 2: ask ONE smart question that only an expert would ask — forces them to reply. Sentence 3: one line that makes moving forward feel easy.",
    "send_after_days": 3
  },
  "win_probability": 0,
  "win_probability_reasoning": "Honest 2-sentence assessment. What specifically makes this proposal strong for this job. What the real risk is."
}`,
      },
    ],
  })

  const rawText = completion.choices[0]?.message?.content || ''

  // Step 1: Strip markdown fences if present
  let cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  // Step 2: Extract just the JSON object if there's text around it
  const firstBrace = cleaned.indexOf('{')
  const lastBrace  = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1)
  }

  // Step 3: Fix common JSON-breaking characters
  // Replace curly/smart quotes with straight quotes
  cleaned = cleaned
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes → '
    .replace(/[\u201C\u201D]/g, '"')   // smart double quotes → "
    .replace(/[\u2013\u2014]/g, '-')   // em/en dashes → -

  // Step 4: Try to parse
  try {
    return JSON.parse(cleaned) as GeneratedProposal
  } catch {
    // Step 5: Last resort — sanitize newlines inside string values
    // This handles the case where the AI puts literal newlines in JSON strings
    const sanitized = cleaned.replace(
      /"((?:[^"\\]|\\.)*)"/g,
      (_match, inner) => {
        const fixed = inner
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '')
          .replace(/\t/g, ' ')
        return `"${fixed}"`
      }
    )
    try {
      return JSON.parse(sanitized) as GeneratedProposal
    } catch {
      throw new Error(
        `Could not parse AI response. Preview: ${cleaned.substring(0, 300)}`
      )
    }
  }
}
