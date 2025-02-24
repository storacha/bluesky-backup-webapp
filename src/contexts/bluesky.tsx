'use client'

import { ProfileViewBasic } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {
  OAuthSession,
  BrowserOAuthClient,
} from "@atproto/oauth-client-browser";

import {
  createContext,
  useContext,
} from "react";

type BskyAuthContextProps = {
  authenticated: boolean;
  session?: OAuthSession;
  state?: string;
  userProfile?: ProfileViewBasic;
  bskyAuthClient?: BrowserOAuthClient;
};

export const BskyAuthContext = createContext<BskyAuthContextProps>({
  authenticated: false,
});

export const useBskyAuthContext = () => {
  return useContext(BskyAuthContext);
};
