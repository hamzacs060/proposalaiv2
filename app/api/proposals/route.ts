import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET — fetch all proposals for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit  = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('proposals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: proposals, error: fetchError } = await query
    if (fetchError) throw fetchError

    return NextResponse.json({ proposals })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH — update proposal status (sent / won / lost)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status, loss_reason, bid_amount } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (loss_reason) updateData.loss_reason = loss_reason
    if (bid_amount)  updateData.bid_amount  = bid_amount
    if (status === 'sent')                        updateData.sent_at   = new Date().toISOString()
    if (status === 'won' || status === 'lost')    updateData.result_at = new Date().toISOString()

    const { data: proposal, error: updateError } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)   // Security: can only update your own proposals
      .select()
      .single()

    if (updateError) throw updateError

    // Log the status change
    await supabase.from('activity_logs').insert({
      user_id:     user.id,
      proposal_id: id,
      action:      'status_changed',
      details:     { new_status: status, loss_reason: loss_reason || null },
    })

    return NextResponse.json({ proposal })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
