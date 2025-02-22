import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session = searchParams.get('session');
  const state = searchParams.get('state');

  if (!session || !state) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Authenticated' });
}
