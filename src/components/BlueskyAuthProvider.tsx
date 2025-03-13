'use client'

import { BskyAuthContext } from "@/contexts";
import { blueskyClientMetadata } from "@/lib/bluesky";
import { REQUIRED_ATPROTO_SCOPE } from "@/lib/constants";
import { Agent } from "@atproto/api";
import {
  OAuthSession,
  BrowserOAuthClient,
} from "@atproto/oauth-client-browser";
import { useQuery } from "@tanstack/react-query";
import {
  JSX,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  children: JSX.Element | JSX.Element[] | ReactNode;
};
export const BskyAuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [bskyAuthClient, setBskyAuthClient] = useState<BrowserOAuthClient>();
  const [session, setSession] = useState<OAuthSession>();
  const [state, setState] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false)
  const [serviceResolver, setServiceResolver] = useState<string>("https://bsky.social");

  const bskyAgent = useMemo(() => {
    if (!authenticated || !session) return;
    return new Agent(session);
  }, [authenticated, session]);

  const { data: userProfile } = useQuery({
    queryKey: ["bsky", "profile", session?.did],
    queryFn: async () => {
      if (!authenticated || !bskyAgent || !bskyAgent.did) return;
      const result = (await bskyAgent.getProfile({ actor: bskyAgent.did }))
        .data;
      return result;
    },
    enabled: authenticated && !!bskyAgent,
  });

  useEffect(() => {
    const initBsky = async () => {
      if (!bskyAuthClient) return;

      const result = await bskyAuthClient.init(true);
      if (result) {
        const { session, state } = result as {
          session: OAuthSession;
          state: string | null;
        };

        if (state != null) {
          console.log(
            `${session.sub} was successfully authenticated (state: ${state})`
          );
          setAuthenticated(true);
          setSession(session);
          setState(state);
        } else {
          console.log(`${session.sub} was restored (last active session)`);

          setAuthenticated(true);
          setSession(session);
        }
      }
      setInitialized(true)
    };

    initBsky();
  }, [bskyAuthClient]);

  // for the custom resolver... another effect that runs when we use a PDS
  useEffect(() => {
    const client = new BrowserOAuthClient({
      clientMetadata: blueskyClientMetadata,
      handleResolver: serviceResolver,
    })
    setBskyAuthClient(client)
  }, [serviceResolver])

  const login = async (handle: string) => {
    if (!bskyAuthClient) return;
    try {
      await bskyAuthClient.signIn(handle, {
        scope: REQUIRED_ATPROTO_SCOPE
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    if (!bskyAuthClient) return;
    try {
      bskyAuthClient.dispose()
      setAuthenticated(false);
      setSession(undefined);
      setState(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const values = {
    state,
    session,
    userProfile,
    initialized,
    authenticated,
    bskyAuthClient,
    agent: bskyAgent,
    serviceResolver,
    login,
    logout,
    setServiceResolver: (url: string) => {
      setServiceResolver(url);
      setInitialized(false)
    }
  }

  return (
    <BskyAuthContext.Provider value={values}>
      {children}
    </BskyAuthContext.Provider>
  );
};

export default BskyAuthProvider;
