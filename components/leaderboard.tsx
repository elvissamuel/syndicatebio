'use client'

import { useEffect, useState } from 'react'
import { Trophy, Medal } from 'lucide-react'

interface LeaderboardEntry {
  username: string
  submission_count: number
  total_engagements: number
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    )
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="text-yellow-500" size={24} />
    if (rank === 1) return <Medal className="text-gray-400" size={24} />
    if (rank === 2) return <Medal className="text-orange-600" size={24} />
    return <span className="font-bold text-lg text-gray-600">#{rank + 1}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" size={28} />
        Leaderboard
      </h2>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No submissions yet</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, rank) => (
            <div
              key={entry.username}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-8">
                  {getMedalIcon(rank)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{entry.username}</h3>
                  <p className="text-sm text-gray-600">
                    {entry.submission_count} submission{entry.submission_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-red-600">{entry.total_engagements}</p>
                <p className="text-xs text-gray-600">total engagements</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
