import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proposals } = await supabase
      .from('proposals')
      .select('status, bid_amount, loss_reason, platform, created_at')
      .eq('user_id', user.id)

    if (!proposals || proposals.length === 0) {
      return NextResponse.json({
        analytics: {
          total: 0, sent: 0, won: 0, lost: 0, winRate: 0,
          totalRevenue: 0, avgBid: 0, thisMonthProposals: 0,
          lossReasons: {}, platforms: {},
        }
      })
    }

    const total        = proposals.length
    const sent         = proposals.filter(p => p.status !== 'draft').length
    const won          = proposals.filter(p => p.status === 'won').length
    const lost         = proposals.filter(p => p.status === 'lost').length
    const winRate      = sent > 0 ? Math.round((won / sent) * 100) : 0
    const totalRevenue = proposals
      .filter(p => p.status === 'won')
      .reduce((sum, p) => sum + (p.bid_amount || 0), 0)
    const avgBid = total > 0
      ? Math.round(proposals.reduce((s, p) => s + (p.bid_amount || 0), 0) / total)
      : 0

    // Loss reasons breakdown
    const lossReasons: Record<string, number> = {}
    proposals.filter(p => p.loss_reason).forEach(p => {
      const reason = p.loss_reason!
      lossReasons[reason] = (lossReasons[reason] || 0) + 1
    })

    // Platform breakdown
    const platforms: Record<string, { sent: number; won: number }> = {}
    proposals.forEach(p => {
      const plat = p.platform || 'Other'
      if (!platforms[plat]) platforms[plat] = { sent: 0, won: 0 }
      if (p.status !== 'draft') platforms[plat].sent++
      if (p.status === 'won')   platforms[plat].won++
    })

    // This month
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const thisMonthProposals = proposals.filter(
      p => new Date(p.created_at) >= monthStart
    ).length

    return NextResponse.json({
      analytics: {
        total, sent, won, lost, winRate,
        totalRevenue, avgBid, thisMonthProposals,
        lossReasons, platforms,
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
