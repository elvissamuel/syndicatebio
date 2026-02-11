export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const leaderboard = await prisma.$queryRaw<
      {
        username: string
        submission_count: number
        total_engagements: number
      }[]
    >`
      SELECT 
        username,
        COUNT(id) as submission_count,
        SUM(engagement_count) as total_engagements
      FROM submissions
      WHERE moderation_status = 'approved'
      GROUP BY username
      ORDER BY total_engagements DESC, submission_count DESC
      LIMIT 50
    `

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('[v0] Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
