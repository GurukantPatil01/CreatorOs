export interface BlueskyPublishResult {
  success: boolean
  url?: string
  postId?: string
  error?: string
}

export class BlueskyProvider {
  /**
   * Publish a real live post directly to Bluesky via ATProto API
   */
  async publishPost(
    handle: string,
    appPassword: string,
    text: string
  ): Promise<BlueskyPublishResult> {
    try {
      // Clean up handle
      const cleanHandle = handle.trim().replace(/^@/, '')
      const cleanPassword = appPassword.trim()

      if (!cleanHandle || !cleanPassword) {
        return {
          success: false,
          error: 'Please provide a valid Bluesky Handle and App Password.',
        }
      }

      // 1. Create ATProto Session
      const sessionRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanHandle,
          password: cleanPassword,
        }),
      })

      if (!sessionRes.ok) {
        const errJson = await sessionRes.json().catch(() => ({}))
        const errMsg = errJson.message || sessionRes.statusText
        return {
          success: false,
          error: `Bluesky Authentication Failed: ${errMsg}`,
        }
      }

      const session = await sessionRes.json()
      const accessJwt = session.accessJwt
      const did = session.did

      // 2. Create Post Record in ATProto Repository
      const postRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessJwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: did,
          collection: 'app.bsky.feed.post',
          record: {
            $type: 'app.bsky.feed.post',
            text: text,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      if (!postRes.ok) {
        const errJson = await postRes.json().catch(() => ({}))
        const errMsg = errJson.message || postRes.statusText
        return {
          success: false,
          error: `Bluesky Post Creation Failed: ${errMsg}`,
        }
      }

      const postData = await postRes.json()
      // Extract rkey from URI: at://did:plc:xxx/app.bsky.feed.post/3kxyz...
      const rkey = postData.uri ? postData.uri.split('/').pop() : `post_${Date.now()}`
      const liveUrl = `https://bsky.app/profile/${cleanHandle}/post/${rkey}`

      return {
        success: true,
        url: liveUrl,
        postId: rkey,
      }
    } catch (err: any) {
      console.error('[BlueskyProvider] Live publishing error:', err)
      return {
        success: false,
        error: `Network Error: ${err.message || 'Unable to connect to Bluesky servers.'}`,
      }
    }
  }
}
