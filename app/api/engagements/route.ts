export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, userId, engagementType } = body

    if (!submissionId || !userId || !engagementType) {
      return NextResponse.json(
        { error: 'submissionId, userId, and engagementType are required' },
        { status: 400 }
      )
    }

    // Check if engagement already exists
    const existing = await prisma.$queryRaw<
      { id: number }[]
    >`
      SELECT id FROM engagements
      WHERE submission_id = ${submissionId} AND user_id = ${userId} AND type = ${engagementType}
    `

    if (existing.length > 0) {
      // Remove existing engagement
      await prisma.$executeRaw`
        DELETE FROM engagements
        WHERE submission_id = ${submissionId} AND user_id = ${userId} AND type = ${engagementType}
      `
    } else {
      // Create new engagement
      await prisma.$executeRaw`
        INSERT INTO engagements (submission_id, user_id, type)
        VALUES (${submissionId}, ${userId}, ${engagementType})
      `
    }

    // Update submission engagement count
    const count = await prisma.$queryRaw<
      { total: bigint | number | string }[]
    >`
      SELECT COUNT(*) as total FROM engagements WHERE submission_id = ${submissionId}
    `

    const totalEngagements = Number(count[0]?.total ?? 0)

    await prisma.$executeRaw`
      UPDATE submissions SET engagement_count = ${totalEngagements}
      WHERE id = ${submissionId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error updating engagement:', error)
    return NextResponse.json({ error: 'Failed to update engagement' }, { status: 500 })
  }
}
