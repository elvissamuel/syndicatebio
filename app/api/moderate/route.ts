import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

// Simple content moderation - check for harmful keywords
const FORBIDDEN_KEYWORDS = [
  'violence',
  'hate',
  'harassment',
  'explicit',
  'spam',
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, message } = body

    if (!submissionId || !message) {
      return NextResponse.json(
        { error: 'submissionId and message are required' },
        { status: 400 }
      )
    }

    const isFlagged = checkContent(message)
    const status = isFlagged ? 'flagged' : 'approved'

    await prisma.$executeRaw`
      UPDATE submissions
      SET moderation_status = ${status}
      WHERE id = ${submissionId}
    `

    if (isFlagged) {
      await prisma.$executeRaw`
        INSERT INTO moderation_logs (submission_id, action, reason)
        VALUES (${submissionId}, 'flag', 'Automated content filter triggered')
      `
    }

    return NextResponse.json({ status, isFlagged })
  } catch (error) {
    console.error('[v0] Error moderating content:', error)
    return NextResponse.json({ error: 'Failed to moderate content' }, { status: 500 })
  }
}

function checkContent(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return FORBIDDEN_KEYWORDS.some((keyword) => lowerMessage.includes(keyword))
}
