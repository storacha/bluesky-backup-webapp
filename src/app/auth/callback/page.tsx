"use client"

import { useBskyAuthContext } from "@/contexts"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OAuthCallback() {
  const { bskyAuthClient, setAuthenticated, setSession, setState } = useBskyAuthContext()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const processCallback = async () => {
      if (!bskyAuthClient) return;

      try {
        const hash = window.location.hash ? window.location.hash.substring(1) : ''

        const params = hash
          ? new URLSearchParams(hash)
          : new URLSearchParams(searchParams.toString())

        console.log("params", params)

        if (!params.has('code') || !params.has('state')) {
          console.error("Missing required parameters in callback URL", params.toString())
          throw new Error("Missing required OAuth parameters")
        }

        const result = await bskyAuthClient.callback(params)

        console.log(`${result.session.sub} was successfully authenticated (state: ${result.state})`)
        setAuthenticated(true)
        setSession(result.session)
        setState(result.state)
        router.push('/')
      } catch (error) {
        console.error("OAuth callback error:", error)
        setError("Authentication failed. Please try again.")
      }
    }

    processCallback()
  }, [bskyAuthClient, router, searchParams, setAuthenticated, setSession, setState])
  return (
    <div className="flex justify-center items-center min-h-screen">
      {error ? (
        <div className="flex flex-col">
          <div className="text-red-500">{error}</div>
          <div className="flex justify-center">
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-sm w-50"
              onClick={() => router.push('/')}
            >
              Return Home
            </button>
          </div>
        </div>
      ) : (
        <div>Completing authentication...</div>
      )}
    </div>
  )
}
