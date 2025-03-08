import { blueskyClientUri, blueskyServerClient } from "@/lib/blueskyServerAuth"
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
  
  const agent = new Agent(session)
  if (!agent.did) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  const profile = await agent.getProfile({ actor: agent.did })

  // Create the response with the session data
  const response = NextResponse.redirect(new URL(`${blueskyClientUri}/`, request.url))
  
  // Set secure HTTP-only cookie with the session data
  response.cookies.set({
    name: 'bluesky_session',
    value: JSON.stringify({
      did: session.did,
      handle: profile.data.handle
    }),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  return response
}
