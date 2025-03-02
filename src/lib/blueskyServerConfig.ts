import { type OAuthClientMetadataInput } from "@atproto/oauth-client-node";

export const blueskyClientUri = process.env.BLUESKY_CLIENT_URI || "https://localhost:3000/"

export const blueskyServerClientMetadata: OAuthClientMetadataInput = {
  "client_id": `${blueskyClientUri}/bluesky-server-client-metadata`,
  "client_name": "Local Dev App",
  "client_uri": blueskyClientUri,
  "application_type": "web",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "redirect_uris": [`${blueskyClientUri}/api/bluesky-auth/callback`],
  "token_endpoint_auth_method": "none",
  "scope": "atproto transition:generic",
  "dpop_bound_access_tokens": true,
  "jwks_uri": `${blueskyClientUri}/jwk.json`,
};
