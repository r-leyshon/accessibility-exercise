#!/usr/bin/env node

/**
 * Saves deployment score (caught A11ymon IDs) to Neon Postgres.
 * Called by the workflow after each audit run.
 *
 * Usage: node scripts/save-score.mjs <deployment_url> <scorecard.json>
 * Requires: DATABASE_URL env var (Neon connection string)
 */

import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const deploymentUrl = process.argv[2];
const scorecardPath = process.argv[3];

if (!deploymentUrl || !scorecardPath) {
  console.error("Usage: node scripts/save-score.mjs <deployment_url> <scorecard.json>");
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

// Normalize: https, no trailing slash
const normalizedUrl = deploymentUrl.replace(/\/$/, "").startsWith("http")
  ? deploymentUrl.replace(/\/$/, "")
  : `https://${deploymentUrl}`;

let scorecard;
try {
  scorecard = JSON.parse(readFileSync(scorecardPath, "utf-8"));
} catch (e) {
  console.error(`Failed to read scorecard: ${e.message}`);
  process.exit(1);
}

const caught = (scorecard.results || [])
  .filter((r) => r.fixed === true)
  .map((r) => r.id)
  .filter((n) => Number.isInteger(n) && n >= 1 && n <= 25);

const sql = neon(dbUrl);

try {
  await sql`
    INSERT INTO deployment_scores (deployment_url, caught)
    VALUES (${normalizedUrl}, ${caught})
    ON CONFLICT (deployment_url)
    DO UPDATE SET caught = EXCLUDED.caught, updated_at = NOW()
  `;
  console.log(`Saved score for ${normalizedUrl}: ${caught.length} A11ymon caught`);
} catch (err) {
  console.error("Failed to save score:", err.message);
  process.exit(1);
}
