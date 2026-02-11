'use client'

import { useEffect, useState } from 'react'
import { Users, Heart, MessageSquare } from 'lucide-react'

export function EngagementMetrics() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalEngagements: 0,
    uniqueUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const submissions = await response.json()
        const uniqueUsers = new Set(submissions.map((s: any) => s.username)).size
        const totalEngagements = submissions.reduce(
          (sum: number, s: any) => sum + (s.engagement_count || 0),
          0
        )

        setStats({
          totalSubmissions: submissions.length,
          totalEngagements,
          uniqueUsers,
        })
      }
    } catch (error) {
      console.error('[v0] Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    {
      label: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Engagements',
      value: stats.totalEngagements,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Community Members',
      value: stats.uniqueUsers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className={`${metric.bgColor} rounded-lg p-6 flex items-start justify-between`}
          >
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.color}`}>{stats.totalSubmissions === 0 && loading ? '—' : metric.value}</p>
            </div>
            <Icon className={`${metric.color}`} size={32} />
          </div>
        )
      })}
    </div>
  )
}
