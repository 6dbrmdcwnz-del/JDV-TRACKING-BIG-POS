JDV ARCADIA LP TRACKER — FLAT CLOUDFLARE DEPLOYMENT
Version 1.5 — D42A Proofed Strict Live Onchain Data

Tracks Arcadia account:
0xd42A3Ac56456bD5422835B36C35Cacb6448ddCd9

WHAT IT SHOWS
- Net equity and official cost-basis P&L
- Gross LP value, debt and effective leverage
- Arcadia health factor and a clearly labeled safety state
- WETH/USDC range, current price, token composition and AERO rewards
- Full current staked-pool identity, strategy, position ID, value, composition and range status
- Observed yield breakdown for USDC, WETH and AERO plus latest-day and seven-recorded-day USD yield
- Arcadia-recorded total yield and 24-hour transfers
- Verified seven-minute Base swap count
- Real WETH buy/sell demand from recent onchain Base DEX swaps
- Seven-minute WETH price pace and market-direction signal

DEPLOY FROM GITHUB / CLOUDFLARE
1. Upload the CONTENTS of this folder to the repository root. Do not upload the outer folder.
2. In Cloudflare Workers & Pages, import the repository.
3. Build command: npm install
4. Deploy command: npm run deploy
5. Root directory: leave blank

LOCAL TEST
1. npm install
2. npm run dev

NOTES
- No private key, seed phrase, login, wallet connection, API key, environment variable or secret is needed.
- Account data comes from Arcadia's official read-only API.
- LP values refresh every 60 seconds; WETH momentum refreshes every 7 minutes.
- Momentum measures actual swap direction and USD size from the two most active liquid WETH/stablecoin pools.
- The seven-minute server cache is always respected, including manual refreshes, preventing request bursts and HTTP 429 loops.
- Market requests never overlap or multiply into retry storms.
- If the live feed is temporarily throttled or unavailable, the card shows LIVE DATA UNAVAILABLE and retries automatically.
- If no verified swaps are available, the app reports unavailable trade data rather than a false 50/50 balanced market.
- No estimated, inferred, cached-last-known or aggregate-split fallback values are displayed.
- WETH demand, volume, swaps and wallet counts come only from verified Base transaction records returned by the live trade feed.
- Values can change rapidly. Verify important actions in Arcadia.

PROOFING CHANGES IN V1.5
- Removed stale legacy account references throughout the deployable source.
- Updated service-worker cache namespace so an iPhone/Home Screen install does not retain the prior UI.
- Updated outbound API client version identifier.
- Added stricter Arcadia response validation: missing/invalid/empty assets fail closed instead of rendering misleading zero-like values.
- Re-ran automated tests and JavaScript syntax checks before packaging.


BUILD FIX 1.5.1
- Static assets isolated in ./public so Wrangler cannot upload node_modules as assets.
- Worker name aligned with Cloudflare connected-build name jdv-tracking-big-pos.
- Worker source and npm dependencies remain outside the assets directory.
