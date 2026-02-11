import { GoogleAuth } from 'google-auth-library'

let cachedAccessToken: string | null = null
let tokenExpiry: number = 0

/**
 * Get a valid Google Cloud access token for Imagen 2 API
 * Uses service account key file or application default credentials
 */
export async function getGoogleAccessToken(): Promise<string> {
  // Check if we have a valid cached token (with 5 minute buffer)
  const now = Date.now()
  if (cachedAccessToken && tokenExpiry > now + 5 * 60 * 1000) {
    return cachedAccessToken
  }

  try {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
    const scopes = ['https://www.googleapis.com/auth/cloud-platform']

    const auth = new GoogleAuth({
      ...(keyFile && { keyFile }),
      scopes,
    })

    const client = await auth.getClient()
    const accessTokenResponse = await client.getAccessToken()

    if (!accessTokenResponse.token) {
      throw new Error('Failed to get access token from Google Auth')
    }

    // Cache the token (Google tokens typically expire in 1 hour)
    cachedAccessToken = accessTokenResponse.token
    tokenExpiry = Date.now() + 55 * 60 * 1000 // Cache for 55 minutes

    return cachedAccessToken
  } catch (error) {
    console.error('Error getting Google access token:', error)
    throw new Error('Failed to authenticate with Google Cloud')
  }
}


