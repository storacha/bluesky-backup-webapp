import { JoseKey } from "@atproto/jwk-jose";
import { NodeOAuthClient, type NodeSavedState, type NodeSavedSession } from "@atproto/oauth-client-node"
import { delSessionStore, delStateStore, getSessionStore, getStateStore, setSessionStore, setStateStore } from './redis'
import { blueskyClientMetadata } from "./bluesky";

if (!process.env.PRIVATE_KEY_1) {
  throw new Error('Missing private keys')
};

// Server authentication implementation.
export const blueskyServerClient = new NodeOAuthClient({
  clientMetadata: blueskyClientMetadata,
  keyset: await Promise.all([
      JoseKey.fromImportable(process.env.PRIVATE_KEY_1),
  ]),

  stateStore: {
      async set(key: string, internalState): Promise<void> {
        await setStateStore(key, internalState);
      },
      async get(key: string): Promise<NodeSavedState | undefined> {
        const state = await getStateStore(key);
        return state;
      },
      async del(key: string): Promise<void> {
        await delStateStore(key);
      },
    },
  
    sessionStore: {
      async set(sub: string, session: NodeSavedSession): Promise<void> {
        await setSessionStore(sub, session);
      },
      async get(sub: string): Promise<NodeSavedSession | undefined> {
        const session = await getSessionStore(sub);
        return session;
      },
      async del(sub: string): Promise<void> {
        await delSessionStore(sub);
      },
    },
})
