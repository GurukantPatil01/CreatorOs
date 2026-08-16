export interface InstagramPublishResult {
  success: boolean
  url?: string
  postId?: string
  error?: string
}

export class InstagramProvider {
  /**
   * Publish a real live post directly to Instagram via Facebook Graph API v19.0
   */
  async publishPost(
    accountId: string,
    accessToken: string,
    caption: string,
    imageUrl?: string
  ): Promise<InstagramPublishResult> {
    try {
      const cleanAccountId = accountId.trim()
      const cleanToken = accessToken.trim()
      const photoUrl = imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'

      if (!cleanAccountId || !cleanToken) {
        return {
          success: false,
          error: 'Please provide a valid Instagram Business Account ID and Graph API Access Token.',
        }
      }

      // Step 1: Create Media Container
      const createContainerUrl = `https://graph.facebook.com/v19.0/${cleanAccountId}/media`
      const containerRes = await fetch(createContainerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: photoUrl,
          caption: caption,
          access_token: cleanToken,
        }),
      })

      if (!containerRes.ok) {
        const errJson = await containerRes.json().catch(() => ({}))
        const errMsg = errJson.error?.message || containerRes.statusText
        return {
          success: false,
          error: `Instagram Media Container Error: ${errMsg}`,
        }
      }

      const containerData = await containerRes.json()
      const creationId = containerData.id

      if (!creationId) {
        return {
          success: false,
          error: 'Instagram API failed to return a valid creation_id.',
        }
      }

      // Step 2: Publish Media Container
      const publishUrl = `https://graph.facebook.com/v19.0/${cleanAccountId}/media_publish`
      const publishRes = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: cleanToken,
        }),
      })

      if (!publishRes.ok) {
        const errJson = await publishRes.json().catch(() => ({}))
        const errMsg = errJson.error?.message || publishRes.statusText
        return {
          success: false,
          error: `Instagram Media Publish Error: ${errMsg}`,
        }
      }

      const publishData = await publishRes.json()
      const mediaId = publishData.id || creationId
      const liveUrl = `https://www.instagram.com/p/${mediaId}/`

      return {
        success: true,
        url: liveUrl,
        postId: mediaId,
      }
    } catch (err: any) {
      console.error('[InstagramProvider] Error publishing to Instagram:', err)
      return {
        success: false,
        error: `Network Error: ${err.message || 'Unable to connect to Instagram Graph API.'}`,
      }
    }
  }
}
