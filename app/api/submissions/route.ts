import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const submissions = await prisma.$queryRaw<
      {
        id: number
        username: string
        message: string
        image_url: string | null
        filter_applied: string
        engagement_count: number
        created_at: Date
      }[]
    >`
      SELECT 
        id,
        username,
        message,
        image_url,
        filter_applied,
        engagement_count,
        created_at
      FROM submissions
      WHERE moderation_status = 'approved'
      ORDER BY created_at DESC
      LIMIT 100
    `
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('[v0] Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, message, imageUrl, filterApplied } = body

    if (!username || (!message && !imageUrl)) {
      return NextResponse.json(
        { error: 'Username and either message or imageUrl are required' },
        { status: 400 }
      )
    }

    const result = await prisma.$queryRaw<
      {
        id: number
        username: string
        message: string
        image_url: string | null
        filter_applied: string
        created_at: Date
      }[]
    >`
      INSERT INTO submissions (username, message, image_url, filter_applied)
      VALUES (${username}, ${message}, ${imageUrl || null}, ${filterApplied || 'none'})
      RETURNING id, username, message, image_url, filter_applied, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating submission:', error)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}
