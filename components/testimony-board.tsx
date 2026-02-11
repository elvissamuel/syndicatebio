'use client'

import { useEffect, useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimony {
  id: number
  username: string
  description: string
  image_url: string
  engagement_count: number
  created_at: string
}

interface TestimonyBoardProps {
  refreshTrigger: number
}

export function TestimonyBoard({ refreshTrigger }: TestimonyBoardProps) {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [userEngagements, setUserEngagements] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchTestimonies()
  }, [refreshTrigger])

  const fetchTestimonies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()
      setTestimonies(data.submissions || [])
    } catch (error) {
      console.error('Failed to fetch testimonies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id: number) => {
    try {
      const isLiked = userEngagements.has(id)
      const response = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: id,
          engagement_type: 'like',
          action: isLiked ? 'remove' : 'add',
        }),
      })

      if (response.ok) {
        const newEngagements = new Set(userEngagements)
        if (isLiked) {
          newEngagements.delete(id)
        } else {
          newEngagements.add(id)
        }
        setUserEngagements(newEngagements)

        // Update engagement count
        setTestimonies((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, engagement_count: t.engagement_count + (isLiked ? -1 : 1) }
              : t
          )
        )
      }
    } catch (error) {
      console.error('Failed to update engagement:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading stories...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {testimonies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No stories yet. Be the first to share yours!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
          {testimonies.map((testimony, index) => (
            <div
              key={testimony.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-rotate-1 border-2 border-amber-100"
              style={{
                transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
              }}
            >
              {/* Sticky Note Style Container */}
              <div className="p-4 space-y-3">
                {/* Image */}
                {testimony.image_url && (
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={testimony.image_url || "/placeholder.svg"}
                      alt={testimony.username}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                {/* User Info */}
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{testimony.username}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(testimony.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Testimony Text */}
                <p className="text-sm text-gray-800 leading-relaxed line-clamp-4">
                  {testimony.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-amber-100">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(testimony.id)}
                    className={`flex-1 ${
                      userEngagements.has(testimony.id)
                        ? 'text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className="w-4 h-4 mr-1"
                      fill={userEngagements.has(testimony.id) ? 'currentColor' : 'none'}
                    />
                    {testimony.engagement_count}
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 text-gray-600">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Sticky Note Pin Effect */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-md hidden group-hover:block" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
