import { NodeOAuthClient , type NodeSavedState, type NodeSavedSession} from '@atproto/oauth-client-node'
import { JoseKey } from '@atproto/jwk-jose'
import { delSessionStore, delStateStore, getSessionStore, getStateStore, setSessionStore, setStateStore } from '@/services/blueskyAuth';

if (!process.env.PRIVATE_KEY_1) {
  throw new Error('Missing private keys')
};

export const blueskyClient = new NodeOAuthClient({
  clientMetadata: {
    client_id: `${process.env.BASE_URL}/client-metadata.json`,
    client_name: 'Bluesky Backup Webapp',
    redirect_uris: [`${process.env.BASE_URL}`],
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    scope: 'atproto transition:generic',
    application_type: 'web',
    token_endpoint_auth_method: 'private_key_jwt',
    token_endpoint_auth_signing_alg: 'RS256',
    dpop_bound_access_tokens: true,
    jwks_uri: `${process.env.BASE_URL}/jwks.json`,
  },

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
});
