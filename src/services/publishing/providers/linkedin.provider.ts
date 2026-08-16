export interface LinkedInPublishResult {
  success: boolean
  url?: string
  postId?: string
  error?: string
}

export class LinkedInProvider {
  /**
   * Publish a real live post directly to LinkedIn via LinkedIn v2 ugcPosts API
   */
  async publishPost(
    accessToken: string,
    personUrn: string,
    text: string
  ): Promise<LinkedInPublishResult> {
    try {
      const cleanToken = accessToken.trim()
      const cleanUrn = personUrn.trim().replace(/^urn:li:person:/, '')

      if (!cleanToken || !cleanUrn) {
        return {
          success: false,
          error: 'Please provide a valid LinkedIn Access Token and Person URN ID.',
        }
      }

      const authorUrn = `urn:li:person:${cleanUrn}`

      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        }),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        const errMsg = errJson.message || res.statusText
        return {
          success: false,
          error: `LinkedIn API Error (${res.status}): ${errMsg}`,
        }
      }

      const data = await res.json()
      // data.id looks like urn:li:share:123456789 or urn:li:ugcPost:123456789
      const postId = data.id ? String(data.id).split(':').pop() : `li_${Date.now()}`
      const liveUrl = `https://www.linkedin.com/feed/update/urn:li:activity:${postId}`

      return {
        success: true,
        url: liveUrl,
        postId: postId,
      }
    } catch (err: any) {
      console.error('[LinkedInProvider] Error publishing to LinkedIn:', err)
      return {
        success: false,
        error: `Network Error: ${err.message || 'Unable to connect to LinkedIn API.'}`,
      }
    }
  }
}
