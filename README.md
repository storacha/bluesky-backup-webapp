# blusky-backup-webapp

## Setup

### Pre-requisite

- npm
- Have Redis run at local (or cloud instance)
- Have tunneling service e.g. ngrok, cloudflared

### Setup

1. Install dependencies (`npm install`)
2. Generate JWK key for using in Bluesky OAuth with `npm run scripts:generate-jwk`
3. Tunnel HTTP from port `3000`
4. Copy `.env.example` to `.env` and fill environment variables as required.
```bash
BASE_URL=       # Base URL of tunneled HTTP
PRIVATE_KEY_1=  # Object of jwk generated in step 2
REDIS_URL=      # URL of redis instance
```
5. Run development server with `npm run dev`
