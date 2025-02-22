import { blueskyClient } from "@/instances/bluesky";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get('handle');
  const state = searchParams.get('state');

  if (!handle || !state) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }

  const controller = new AbortController();
  const signal = controller.signal;

  const url = await blueskyClient.authorize(handle, {
    signal: signal,
    state,
    ui_locales: 'fr-CA fr en',
  });

  return NextResponse.redirect(url);
}
