import { blueskyServerClient } from "@/lib/blueskyServerAuth"
import { Agent } from "@atproto/api"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const { session, state } = await blueskyServerClient.callback(searchParams)
  const token = await session.getTokenInfo()
  
  console.log('authorize() was called with state:', state)
  console.log('User authenticated as:', session.did)
  console.log('Token:', token)

  const agent = new Agent(session)
  if (!agent.did) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  const profile = await agent.getProfile({ actor: agent.did })
  console.log('Bsky profile:', profile.data)

  return NextResponse.json({ ok: true })
}
