import { NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo_user'

    const creds = store.getUserCredentials(userId) || { userId }
    return NextResponse.json({
      success: true,
      credentials: {
        userId: creds.userId,
        blueskyConnected: !!(creds.blueskyHandle && creds.blueskyPassword),
        blueskyHandle: creds.blueskyHandle || '',
        linkedinConnected: !!(creds.linkedinToken && creds.linkedinUrn),
        linkedinUrn: creds.linkedinUrn || '',
        instagramConnected: !!(creds.instagramAccountId && creds.instagramToken),
        instagramAccountId: creds.instagramAccountId || '',
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
    const userId = user?.id || 'demo_user'

    const body = await req.json()
    const { blueskyHandle, blueskyPassword, linkedinToken, linkedinUrn, instagramAccountId, instagramToken } = body

    store.setUserCredentials({
      userId,
      blueskyHandle: blueskyHandle !== undefined ? blueskyHandle : undefined,
      blueskyPassword: blueskyPassword !== undefined ? blueskyPassword : undefined,
      linkedinToken: linkedinToken !== undefined ? linkedinToken : undefined,
      linkedinUrn: linkedinUrn !== undefined ? linkedinUrn : undefined,
      instagramAccountId: instagramAccountId !== undefined ? instagramAccountId : undefined,
      instagramToken: instagramToken !== undefined ? instagramToken : undefined,
    })

    return NextResponse.json({
      success: true,
      message: 'Platform integration credentials saved successfully for account',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save integration credentials'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
