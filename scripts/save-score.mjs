#!/usr/bin/env node

/**
 * Saves deployment score (caught A11ymon IDs) to Neon Postgres.
 * Called by the workflow after each audit run.
 *
 * For PRs, uses pr_key (owner/repo#prN) so scores persist across redeploys.
 * When axe-report.json is provided, enriches the scorecard with axe results
 * so the saved score matches the PR comment (includes axe-verified bugs).
 *
 * Usage: node scripts/save-score.mjs <deployment_url> <scorecard.json> [axe-report.json]
 * Env:   DATABASE_URL (required), GITHUB_REPOSITORY + GITHUB_PR_NUMBER (for PR-stable lookup),
 *        GITHUB_PR_AUTHOR (PR author login for gallery display)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const deploymentUrl = process.argv[2];
const scorecardPath = process.argv[3];
const axeReportPath = process.argv[4];

if (!deploymentUrl || !scorecardPath) {
  console.error("Usage: node scripts/save-score.mjs <deployment_url> <scorecard.json> [axe-report.json]");
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

const repo = process.env.GITHUB_REPOSITORY;
const prNum = process.env.GITHUB_PR_NUMBER;
const prAuthor = process.env.GITHUB_PR_AUTHOR;
const prKey = repo && prNum ? `${repo}#pr${prNum}` : null;

let scorecard;
try {
  scorecard = JSON.parse(readFileSync(scorecardPath, "utf-8"));
} catch (e) {
  console.error(`Failed to read scorecard: ${e.message}`);
  process.exit(1);
}

// Enrich with axe results when available (so saved score matches PR comment)
if (axeReportPath && existsSync(axeReportPath)) {
  try {
    const axeReport = JSON.parse(readFileSync(axeReportPath, "utf-8"));
    const a11ymon = JSON.parse(readFileSync(resolve(projectRoot, "data/a11ymon.json"), "utf-8"));
    if (axeReport?.violations && a11ymon?.length) {
      const violationIds = new Set(axeReport.violations.map((v) => v.id));
      const a11ymonById = Object.fromEntries(a11ymon.map((b) => [b.id, b]));
      scorecard = {
        ...scorecard,
        results: scorecard.results.map((r) => {
          if (r.status !== "checked_by_axe") return r;
          const ruleId = a11ymonById[r.id]?.detection?.rule;
          if (!ruleId) return r;
          return { ...r, fixed: !violationIds.has(ruleId) };
        }),
      };
    }
  } catch {
    // fall back to raw scorecard
  }
}

const caught = (scorecard.results || [])
  .filter((r) => r.fixed === true)
  .map((r) => r.id)
  .filter((n) => Number.isInteger(n) && n >= 1 && n <= 25);

const sql = neon(dbUrl);

try {
  if (prKey) {
    await sql`
      INSERT INTO deployment_scores (deployment_url, pr_key, username, caught)
      VALUES (${normalizedUrl}, ${prKey}, ${prAuthor ?? null}, ${caught})
      ON CONFLICT (pr_key)
      DO UPDATE SET
        deployment_url = EXCLUDED.deployment_url,
        username = COALESCE(EXCLUDED.username, deployment_scores.username),
        caught = EXCLUDED.caught,
        updated_at = NOW()
    `;
    console.log(`Saved score for ${prKey} (${normalizedUrl}): ${caught.length} A11ymon caught`);
  } else {
    await sql`
      INSERT INTO deployment_scores (deployment_url, caught)
      VALUES (${normalizedUrl}, ${caught})
      ON CONFLICT (deployment_url)
      DO UPDATE SET caught = EXCLUDED.caught, updated_at = NOW()
    `;
    console.log(`Saved score for ${normalizedUrl}: ${caught.length} A11ymon caught`);
  }
} catch (err) {
  console.error("Failed to save score:", err.message);
  process.exit(1);
}
