# K DRAMA

Hindi K-drama shorts from Hindi Kahaniya Sunao.

## Cloudflare pe daalne ke steps

1. Is zip ko extract karo.
2. GitHub repo `k-drama` me saari files upload karo (Add file → Upload files).
3. Cloudflare → Connect GitHub → `k-drama` repo choose karo.
4. Build command: `node scripts/with-app-env.mjs vite build`
5. Deploy command: `npx wrangler deploy`
6. Save and Deploy.
