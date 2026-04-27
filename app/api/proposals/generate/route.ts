import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { generateProposal } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    // 1. Check the user is logged in
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    // 2. Get user's profile (for personalizing the AI output)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // 3. Get the job post from request body
    const body = await request.json()
    const { jobPost, clientName, platform } = body

    // 4. Validate input
    if (!jobPost || jobPost.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please paste a job description (minimum 50 characters)' },
        { status: 400 }
      )
    }

    // 5. Call Claude API
    const generated = await generateProposal(jobPost, {
      name:           profile?.full_name,
      freelancerType: profile?.freelancer_type,
      skills:         profile?.skills,
      hourlyRate:     profile?.hourly_rate,
      bio:            profile?.bio,
    })

    // 6. Save to database
    const { data: proposal, error: insertError } = await supabase
      .from('proposals')
      .insert({
        user_id:                  user.id,
        job_post:                 jobPost,
        client_name:              clientName || null,
        platform:                 platform || 'Other',
        proposal_text:            generated.proposal.full_text,
        subject_line:             generated.proposal.subject_line,
        pricing_suggestion:       generated.pricing,
        scope_of_work:            generated.scope,
        follow_up_email:          generated.follow_up.body,
        follow_up_subject:        generated.follow_up.subject,
        win_probability:          generated.win_probability,
        win_probability_reasoning: generated.win_probability_reasoning,
        bid_amount:               generated.pricing.total,
        status:                   'draft',
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 7. Log this action
    await supabase.from('activity_logs').insert({
      user_id:     user.id,
      proposal_id: proposal.id,
      action:      'proposal_generated',
      details: {
        win_probability: generated.win_probability,
        platform:        platform || 'Other',
        bid_amount:      generated.pricing.total,
      },
    })

    // 8. Return everything to the frontend
    return NextResponse.json({ proposal, generated }, { status: 200 })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong'
    console.error('[generate/route.ts]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
