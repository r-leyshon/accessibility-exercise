-- Add username column for gallery submissions (PR author).
-- Run once in Neon SQL Editor: copy/paste this, then Execute.

ALTER TABLE deployment_scores
ADD COLUMN IF NOT EXISTS username TEXT;
