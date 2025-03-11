"use client";

import { useBskyAuthContext } from "@/contexts";
import { ATPROTO_DEFAULT_SINK, REQUIRED_ATPROTO_SCOPE } from "@/lib/constants";
import { useCallback, useState } from "react";
import { AtprotoLoginForm, LoginFn } from "./RestoreUI";
import { Agent, CredentialSession } from "@atproto/api";
import { useLocalPdsSession } from "@/lib/local-pds-session";

export default function BlueskyAuthenticator () {
  const { initialized, authenticated, bskyAuthClient, userProfile, session } = useBskyAuthContext();
  const { session: localCredSession } = useLocalPdsSession()

  const [handle, setHandle] = useState<string>("");
  const [hasPds, setHasPds] = useState<boolean>(false);
  const [, setSinkAgent] = useState<Agent>()
  const [sinkSession, setSinkSession] = useState<CredentialSession | undefined>(
    localCredSession?.pdSession
  )

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

  const loginToSink: LoginFn = async (identifier, password, { server = ATPROTO_DEFAULT_SINK } = { server: ATPROTO_DEFAULT_SINK }) => {
    const session = new CredentialSession(new URL(server));
    await session.login({ identifier, password });
    const agent = new Agent(session);
    setSinkSession(session);
    setSinkAgent(agent);

    const sessionData = {
      serviceUrl: session.serviceUrl.toString(),
      session: {
        handle: session?.session?.handle,
        did: session?.session?.did,
        accessJwt: session?.session?.accessJwt,
        refreshJwt: session?.session?.refreshJwt,
      }
    };
    localStorage.setItem("localSession", JSON.stringify(sessionData));
  };

  return (
    <div>
      {initialized ? (
        authenticated || sinkSession ? (
          <div>
            {sinkSession ? (
              <p className="text-sm">
                Authenticated to your new Bluesky host <b>{sinkSession.serviceUrl.origin && new URL(sinkSession.serviceUrl.origin).hostname}</b> as <b>{sinkSession.session?.handle}</b>
              </p>
            ) : (
              <p className="text-sm">
                Authenticated to Bluesky as <b>{userProfile?.handle}</b> on <b>{session?.serverMetadata.issuer}</b>
              </p>
            )}
          </div>
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

              <div className="mt-2 w-100">
                <p className="text-sm">
                  Click the button below to login via your PDS
                </p>
                <button className="btn" onClick={() => setHasPds(true)}>Login with PDS</button>
                {hasPds && (
                  <div className="mt-4">
                    <AtprotoLoginForm login={loginToSink} defaultServer={ATPROTO_DEFAULT_SINK} />
                  </div>
                )}
              </div>
          </div>
        )) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
