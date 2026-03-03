#!/usr/bin/env node

/**
 * Feedback report generator.
 * Takes the bug checker scorecard and axe audit results
 * and produces a PR comment with caught/remaining tables and A11yDex link.
 *
 * Usage: node scripts/generate-report.mjs <scorecard.json> [axe-report.json] [preview-url] [pr-key]
 * Output: Markdown PR comment to stdout
 * pr-key: optional "owner/repo#prN" for PR-stable A11ydex link (works without Vercel system env vars)
 */

import { readFileSync } from "fs";

const scorecardPath = process.argv[2];
const axeReportPath = process.argv[3];
const previewUrl = process.argv[4]; // optional: Vercel preview URL for A11yDex link
const prKey = process.argv[5]; // optional: owner/repo#prN for PR-stable lookup

if (!scorecardPath) {
  console.error(
    "Usage: node scripts/generate-report.mjs <scorecard.json> [axe-report.json]"
  );
  process.exit(1);
}

let scorecard;
let axeReport = null;

try {
  scorecard = JSON.parse(readFileSync(scorecardPath, "utf-8"));
} catch (e) {
  console.error(`Failed to parse scorecard: ${e.message}`);
  process.exit(1);
}

if (axeReportPath) {
  try {
    const content = readFileSync(axeReportPath, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed.violations !== "undefined") {
      axeReport = parsed;
    }
  } catch {
    // axe-report may contain error text if the audit failed; treat as no axe data
  }
}

function buildScorecardMarkdown(scorecard) {
  const caught = scorecard.results.filter((r) => r.fixed === true);
  const remaining = scorecard.results.filter((r) => r.fixed === false);
  const manual = scorecard.results.filter(
    (r) => r.status === "manual_check_required" || r.status === "checked_by_axe"
  );

  let md = `## A11yDex Progress Report\n\n`;
  md += `**${scorecard.fixed} / ${scorecard.total} A11ymon caught!**`;

  if (scorecard.fixed === scorecard.total) {
    md += ` Congratulations, trainer — you caught them all!\n\n`;
  } else if (scorecard.fixed >= 20) {
    md += ` Almost there, trainer!\n\n`;
  } else if (scorecard.fixed >= 10) {
    md += ` Keep going, trainer!\n\n`;
  } else {
    md += ` Your journey is just beginning, trainer!\n\n`;
  }

  if (caught.length > 0) {
    md += `### Caught\n\n`;
    md += `| # | A11ymon | WCAG | Principle |\n`;
    md += `|---|---------|------|-----------|\n`;
    for (const r of caught) {
      md += `| ${r.id} | ${r.name} | ${r.wcag} | ${r.principle} |\n`;
    }
    md += `\n`;
  }

  if (remaining.length > 0) {
    md += `### Still at Large\n\n`;
    md += `| # | A11ymon | WCAG | Hint |\n`;
    md += `|---|---------|------|------|\n`;
    for (const r of remaining) {
      md += `| ${r.id} | ${r.name} | ${r.wcag} | ${r.hint} |\n`;
    }
    md += `\n`;
  }

  if (manual.length > 0) {
    md += `### Needs Manual Review\n\n`;
    md += `| # | A11ymon | WCAG | Note |\n`;
    md += `|---|---------|------|------|\n`;
    for (const r of manual) {
      md += `| ${r.id} | ${r.name} | ${r.wcag} | ${r.status === "checked_by_axe" ? "Verified by axe-core runtime audit" : "Requires manual testing"} |\n`;
    }
    md += `\n`;
  }

  if (axeReport) {
    md += `### axe-core Audit Summary\n\n`;
    md += `- **Violations found**: ${axeReport.violationCount}\n`;
    md += `- **Rules passing**: ${axeReport.passes}\n`;
    if (axeReport.violations?.length > 0) {
      md += `\n| Rule | Impact | Count | Description |\n`;
      md += `|------|--------|-------|-------------|\n`;
      for (const v of axeReport.violations.slice(0, 15)) {
        md += `| ${v.id} | ${v.impact} | ${v.nodes} | ${v.description} |\n`;
      }
    }
    md += `\n`;
  }

  return md;
}

function buildA11yDexLink(previewUrl, prKey) {
  if (!previewUrl || !previewUrl.startsWith("http")) return "";
  const base = previewUrl.replace(/\/$/, "");
  const qs = prKey ? `?pr_key=${encodeURIComponent(prKey)}` : "";
  return `\n\n[📖 View your A11yDex progress](${base}/a11ydex${qs})\n`;
}

function main() {
  let markdown = buildScorecardMarkdown(scorecard);

  if (previewUrl) {
    markdown += buildA11yDexLink(previewUrl, prKey);
  }

  console.log(markdown);
}

main();
