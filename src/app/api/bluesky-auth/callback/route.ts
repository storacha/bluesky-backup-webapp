import { blueskyServerClient } from "@/lib/blueskyServerAuth"
import { Agent } from "@atproto/api"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ message: 'No code provided' }, { status: 400 })
  }

  const { session, state } = await blueskyServerClient.callback(searchParams)
  if (!session || !state) {
    return NextResponse.json({ message: 'Invalid authentication response' }, { status: 400 })
  }
  
  console.log('authorize() was called with state:', state)
  console.log('User authenticated as:', session.did)

  const agent = new Agent(session)
  if (!agent.did) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  const profile = await agent.getProfile({ actor: agent.did })
  console.log('Bsky profile:', profile.data)

  return NextResponse.json({ ok: true })
}
