import { blueskyServerClientMetadata } from "@/lib/blueskyServerConfig"
export const runtime = 'edge'

export async function GET() {
  return Response.json(blueskyServerClientMetadata)
}
