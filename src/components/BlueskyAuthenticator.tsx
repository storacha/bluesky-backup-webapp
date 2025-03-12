"use client";
import { useBskyAuthContext } from "@/contexts";
import { REQUIRED_ATPROTO_SCOPE } from "@/lib/constants";
import { useCallback, useState, useMemo } from "react";

export default function BlueskyAuthenticator() {
  const {
    initialized,
    authenticated,
    bskyAuthClient,
    serviceResolver,
    userProfile,
    session,
    setServiceResolver
  } = useBskyAuthContext();

  const [handle, setHandle] = useState<string>("");
  const [customPdsInput, setCustomPdsInput] = useState<string>("");

  const pdsHostname = useMemo(() => {
    try {
      return new URL(serviceResolver!).hostname;
    } catch {
      return "bsky.social";
    }
  }, [serviceResolver]);

  const signIn = useCallback(async () => {
    if (!bskyAuthClient) return;
    try {
      await bskyAuthClient.signIn(handle, {
        scope: REQUIRED_ATPROTO_SCOPE,
      });
    } catch (err) {
      console.log(err);
    }
  }, [handle, bskyAuthClient]);

  const handleCustomPds = () => {
    if (customPdsInput) {
      try {
        const url = new URL(customPdsInput);
        setServiceResolver(url.toString());
        setCustomPdsInput("");
      } catch (err) {
        console.error(`${(err as Error).message}`);
      }
    }
  };

  return (
    <div>
      {initialized ? (
        authenticated ? (
          <div>
            Authenticated to Bluesky as {userProfile?.handle} on {session?.serverMetadata.issuer}
          </div>
        ) : (
          <>
            <div>
              <input
                onChange={(e) => setHandle(e.target.value)}
                value={handle}
                placeholder={`Full Handle (eg, racha.${pdsHostname})`}
                className="px-2 py-1 border rounded-s-lg w-82 hover:bg-white outline-none"
              />
              <button
                onClick={signIn}
                className="px-2 py-1 border rounded-e-lg cursor-pointer hover:bg-white">
                Sign in
              </button>
            </div>
            {serviceResolver === "https://bsky.social" && (
              <>
                <div className="my-2">
                  <p className="text-center uppercase">or</p>
                  <p className="text-center">Use your custom PDS</p>
                </div>
                <div>
                  <input
                    onChange={(e) => setCustomPdsInput(e.target.value)}
                    value={customPdsInput}
                    placeholder="Custom PDS URL (e.g., https://my-pds.com)"
                    className="px-2 py-1 border rounded-s-lg w-82 hover:bg-white outline-none"
                  />
                  <button
                    onClick={handleCustomPds}
                    className="px-2 py-1 border rounded-e-lg cursor-pointer hover:bg-white">
                    Set PDS
                  </button>
                </div>
              </>
            )}
          </>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
