"use client";

import { useBskyAuthContext } from "@/contexts/bluesky";
import { useCallback, useState } from "react";

export default function BlueskyAuthenticator () {
  const { initialized, authenticated, bskyAuthClient } = useBskyAuthContext();

  const [handle, setHandle] = useState<string>("");

  const signIn = useCallback(async () => {
    if (!bskyAuthClient) return;
    try {
      await bskyAuthClient.signIn(handle, {
        scope: "atproto transition:generic",
      });
    } catch (err) {
      console.log(err);
    }
  }, [handle, bskyAuthClient]);

  return (
    <div>
      {initialized ? (
        authenticated ? (
          <div>Authenticated to Bluesky!</div>
        ) : (
          <div>
            <input
              onChange={(e) => {
                e.preventDefault();
                setHandle(e.target.value);
              }}
              value={handle}
              placeholder="Full Bluesky Handle (eg, racha.bsky.social)"
              className="ipt w-82"
            />
            <button
              onClick={signIn}
              className="btn">
              Sign in
            </button>
          </div>
        )) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
