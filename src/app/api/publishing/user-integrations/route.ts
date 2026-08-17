import { NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in with Supabase Auth to access platform integrations.' },
        { status: 401 }
      )
    }

    const creds = store.getUserCredentials(user.id) || { userId: user.id }
    return NextResponse.json({
      success: true,
      credentials: {
        userId: user.id,
        userEmail: user.email,
        blueskyConnected: !!(creds.blueskyHandle && creds.blueskyPassword),
        blueskyHandle: creds.blueskyHandle || '',
        linkedinConnected: !!(creds.linkedinToken && creds.linkedinUrn),
        linkedinUrn: creds.linkedinUrn || '',
        instagramConnected: !!(creds.instagramAccountId && creds.instagramToken),
        instagramAccountId: creds.instagramAccountId || '',
        youtubeConnected: !!creds.youtubeAccessToken,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user integrations'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in with Supabase Auth to manage platform integrations.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { blueskyHandle, blueskyPassword, linkedinToken, linkedinUrn, instagramAccountId, instagramToken, youtubeAccessToken } = body

    store.setUserCredentials({
      userId: user.id,
      blueskyHandle: blueskyHandle !== undefined ? blueskyHandle : undefined,
      blueskyPassword: blueskyPassword !== undefined ? blueskyPassword : undefined,
      linkedinToken: linkedinToken !== undefined ? linkedinToken : undefined,
      linkedinUrn: linkedinUrn !== undefined ? linkedinUrn : undefined,
      instagramAccountId: instagramAccountId !== undefined ? instagramAccountId : undefined,
      instagramToken: instagramToken !== undefined ? instagramToken : undefined,
      youtubeAccessToken: youtubeAccessToken !== undefined ? youtubeAccessToken : undefined,
    })

    return NextResponse.json({
      success: true,
      message: `Platform integrations saved successfully for account (${user.email})`,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save integration credentials'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
