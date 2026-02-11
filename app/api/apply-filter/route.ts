import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAccessToken } from '@/lib/google-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageBase64, filterType } = body

    if (!imageBase64 || !filterType) {
      return NextResponse.json(
        { error: 'imageBase64 and filterType are required' },
        { status: 400 }
      )
    }

    // Use Google Imagen 2 for image generation/editing
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'GOOGLE_CLOUD_PROJECT_ID is not configured on the server' },
        { status: 500 }
      )
    }

    // Get access token using Google Auth Library
    const accessToken = await getGoogleAccessToken()

    // Clean base64 string (remove data URL prefix if present)
    const base64Image = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64

    const prompt = getFilterPrompt(filterType)

    // Imagen 2 API endpoint
    // Model: imagegeneration@006 (Imagen 2) or imagen-2
    // Documentation: https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview
    const model = process.env.IMAGEN_MODEL || 'imagegeneration@006'
    const imagenUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`

    const imagenResponse = await fetch(imagenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
            // For image-to-image editing, include the base image
            image: {
              bytesBase64Encoded: base64Image,
            },
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: '1:1',
          safetyFilterLevel: 'block_some',
          personGeneration: 'allow_all',
        },
      }),
    })

    if (!imagenResponse.ok) {
      let errorBody: unknown = null
      try {
        errorBody = await imagenResponse.text()
      } catch {
        // ignore
      }
      console.error('Imagen 2 API error:', imagenResponse.status, imagenResponse.statusText, errorBody)
      return NextResponse.json(
        { error: 'Failed to apply filter using Imagen 2 API' },
        { status: 500 }
      )
    }

    const result = await imagenResponse.json()

    // Imagen 2 returns base64 encoded images in the predictions array
    // Extract image data from the response
    const imageData = extractImageFromImagenResponse(result) || imageBase64

    return NextResponse.json({
      image: imageData,
      prompt: prompt,
      model: model,
    })
  } catch (error) {
    console.error('Error applying filter:', error)
    return NextResponse.json({ error: 'Failed to apply filter' }, { status: 500 })
  }
}

function extractImageFromImagenResponse(response: any): string | null {
  try {
    // Imagen 2 returns images in predictions array
    // Each prediction has bytesBase64Encoded field
    if (response.predictions && response.predictions.length > 0) {
      const firstPrediction = response.predictions[0]
      if (firstPrediction.bytesBase64Encoded) {
        return `data:image/png;base64,${firstPrediction.bytesBase64Encoded}`
      }
      // Alternative format: might be in mimeType and bytesBase64Encoded separately
      if (firstPrediction.mimeType && firstPrediction.bytesBase64Encoded) {
        return `data:${firstPrediction.mimeType};base64,${firstPrediction.bytesBase64Encoded}`
      }
    }
    // If no image data found, return null (will use original image)
    return null
  } catch {
    return null
  }
}

function getFilterPrompt(filterType: string): string {
  const prompts: Record<string, string> = {
    military: 'Transform this photo into a high-quality anime illustration. Clean line art, large expressive eyes, soft shading, vibrant colors, studio-quality anime style, keep facial features recognizable',
    defiant: 'Transform this photo into a high-quality anime illustration. Clean line art, large expressive eyes, soft shading, vibrant colors, studio-quality anime style, keep facial features recognizable',
    warrior: 'Transform this photo into a high-quality anime illustration. Clean line art, large expressive eyes, soft shading, vibrant colors, studio-quality anime style, keep facial features recognizable',
    fierce: 'Transform this photo into a high-quality anime illustration. Clean line art, large expressive eyes, soft shading, vibrant colors, studio-quality anime style, keep facial features recognizable',
  }
  return prompts[filterType] || prompts.defiant
}
