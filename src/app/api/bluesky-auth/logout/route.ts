import { blueskyServerClient } from "@/lib/blueskyServerAuth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sub = searchParams.get('sub')

  if (!sub) {
    return NextResponse.json({ error: 'No sub provided' }, { status: 400 })
  }

  await blueskyServerClient.revoke(sub)

  const cookieStore = await cookies()
  cookieStore.delete('bluesky_session')

  return NextResponse.json({ success: true })
}
