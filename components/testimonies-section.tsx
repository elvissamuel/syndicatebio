'use client'

import { useState } from 'react'
import { TestimonyForm } from './testimony-form'
import { TestimonyBoard } from './testimony-board'

export function TestimoniesSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTestimonySubmitted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Stories of Hope and Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community. Share your journey, upload a photo with your story, and inspire others
            to take charge of their genetic health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <TestimonyForm onSubmit={handleTestimonySubmitted} />
          </div>

          {/* Board Column */}
          <div className="lg:col-span-2">
            <TestimonyBoard refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </section>
  )
}
