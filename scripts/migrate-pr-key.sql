-- Add pr_key column for PR-stable lookups (scores persist across Vercel redeploys).
-- Run once in Neon SQL Editor: copy/paste this, then Execute.

ALTER TABLE deployment_scores
ADD COLUMN IF NOT EXISTS pr_key TEXT UNIQUE;

-- Optional: create index for faster pr_key lookups
CREATE INDEX IF NOT EXISTS idx_deployment_scores_pr_key
ON deployment_scores (pr_key) WHERE pr_key IS NOT NULL;
