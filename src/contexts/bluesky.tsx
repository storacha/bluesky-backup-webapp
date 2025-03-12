'use client'

import { Agent } from "@atproto/api";
import { ProfileViewBasic } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {
  OAuthSession,
  BrowserOAuthClient,
} from "@atproto/oauth-client-browser";

import {
  createContext,
  useContext,
} from "react";

export type BskyAuthContextProps = {
  initialized: boolean;
  authenticated: boolean;
  session?: OAuthSession;
  state?: string;
  userProfile?: ProfileViewBasic;
  bskyAuthClient?: BrowserOAuthClient;
  agent?: Agent;
  serviceResolver?: string;
  setServiceResolver: (url: string) => void;
};

export const BskyAuthContext = createContext<BskyAuthContextProps>({
  initialized: false,
  authenticated: false,
  setServiceResolver: () => {}
});

export const useBskyAuthContext = () => {
  return useContext(BskyAuthContext);
};
