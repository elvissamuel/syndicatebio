'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface Submission {
  id: string
  username: string
  message: string
  image_url?: string
  filter_applied: string
  engagement_count: number
  created_at: string
}

interface WallGalleryProps {
  refreshTrigger?: number
}

export function WallGallery({ refreshTrigger = 0 }: WallGalleryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [userEngagements, setUserEngagements] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSubmissions()
  }, [refreshTrigger])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEngagement = async (submissionId: string) => {
    const userId = `user-${Date.now()}`
    const engagementId = `${submissionId}-${userId}`

    try {
      await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          userId,
          engagementType: 'like',
        }),
      })

      setUserEngagements((prev) => {
        const updated = new Set(prev)
        if (updated.has(engagementId)) {
          updated.delete(engagementId)
        } else {
          updated.add(engagementId)
        }
        return updated
      })

      fetchSubmissions()
    } catch (error) {
      console.error('[v0] Error updating engagement:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No submissions yet. Be the first to share your defiance!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Wall of Defiance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {submissions.map((submission) => {
          const engagementId = `${submission.id}-user`
          const isEngaged = userEngagements.has(engagementId)

          return (
            <div
              key={submission.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {submission.image_url && (
                <img
                  src={submission.image_url || "/placeholder.svg"}
                  alt={`${submission.username}'s submission`}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{submission.username}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {submission.filter_applied !== 'none' && (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {submission.filter_applied}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{submission.message}</p>
                <div className="flex items-center justify-between text-gray-600">
                  <button
                    onClick={() => handleEngagement(submission.id)}
                    className={`flex items-center gap-2 hover:text-red-600 transition-colors ${
                      isEngaged ? 'text-red-600' : ''
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={isEngaged ? 'currentColor' : 'none'}
                      strokeWidth={2}
                    />
                    <span className="text-sm font-medium">{submission.engagement_count}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle size={20} />
                    <span className="text-sm">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
                    <Share2 size={20} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
