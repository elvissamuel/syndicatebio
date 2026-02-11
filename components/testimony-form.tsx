'use client'

import React from 'react'
import { useState, useRef } from 'react'
import { Upload, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface TestimonyFormProps {
  onSubmit: () => void
}

export function TestimonyForm({ onSubmit }: TestimonyFormProps) {
  const [name, setName] = useState('')
  const [testimony, setTestimony] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState('natural')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filters = [
    { id: 'natural', label: 'Natural', description: 'Keep the original' },
    { id: 'vibrant', label: 'Vibrant', description: 'Enhanced colors' },
    { id: 'warm', label: 'Warm', description: 'Warm tones' },
    { id: 'professional', label: 'Professional', description: 'Clean & sharp' },
  ]

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyFilter = async () => {
    if (!preview) return

    setLoading(true)
    try {
      const response = await fetch('/api/apply-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: preview,
          filterType: selectedFilter,
        }),
      })

      const data = await response.json()
      if (data.filteredImage) {
        setPreview(data.filteredImage)
      }
    } catch (error) {
      console.error('Filter application failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !testimony.trim() || !preview) {
      alert('Please fill in all fields and upload an image')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          description: testimony,
          title: `${name}'s Story`,
          image_url: preview,
          filter_type: selectedFilter,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setName('')
        setTestimony('')
        setImage(null)
        setPreview('')
        setSelectedFilter('natural')
        setTimeout(() => {
          setSubmitted(false)
          onSubmit()
        }, 2000)
      }
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Failed to submit testimony')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 sticky top-20 bg-card border-2">
      <h3 className="text-2xl font-bold mb-6">Share Your Story</h3>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Check className="w-16 h-16 text-green-500 mb-4" />
          <h4 className="text-lg font-semibold mb-2">Thank you!</h4>
          <p className="text-muted-foreground">Your story has been shared with our community.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Photo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer hover:bg-primary/5 transition"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Click to upload photo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={loading}
              />
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-auto" />
              </div>

              {/* Filter Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Photo Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        selectedFilter === filter.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary'
                      }`}
                      disabled={loading}
                    >
                      <div className="font-medium text-sm">{filter.label}</div>
                      <div className="text-xs text-muted-foreground">{filter.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Filter Button */}
              <Button
                type="button"
                variant="outline"
                onClick={applyFilter}
                disabled={loading}
                className="w-full bg-transparent"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  'Apply Photo Style'
                )}
              </Button>
            </div>
          )}

          {/* Testimony Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Story</label>
            <Textarea
              placeholder="Share your journey, what genetic testing means to you, or how it helped your family..."
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              rows={5}
              disabled={loading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {testimony.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !name.trim() || !testimony.trim() || !preview}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              'Share Your Story'
            )}
          </Button>
        </form>
      )}
    </Card>
  )
}
