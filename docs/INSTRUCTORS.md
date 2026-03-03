# For Instructors

## Deployment (Vercel)

1. Connect the GitHub repo to a Vercel project.
2. In **Settings → Build & Development**: set Framework Preset to **Next.js**, leave Output Directory **empty**.
3. Add environment variables:
   - `GCP_PROJECT_ID`
   - `GCP_LOCATION` (e.g. `europe-west2`)
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON` (full service account JSON)
   - `VERCEL_API_TOKEN` (for gallery)
   - `VERCEL_PROJECT_ID` (for gallery)
4. Add GitHub Actions secrets:
   - `GCP_PROJECT_ID`
   - `GCP_LOCATION`
   - `GCP_SA_KEY` (service account JSON)

If builds succeed but all routes 404, see `docs/VERCEL_404_REPORT.md`.

## Gallery

Visit `/gallery` on the production URL to see submissions (from `access-audit/*` branches).

## Reuse

The `main` branch is protected. PRs are not merged, so the exercise can be reused across cohorts.

## A11ymon images

Place images in `public/a11ymon/` as `01.png` … `25.png`. See `public/a11ymon/README.md` for details.
