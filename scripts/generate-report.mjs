#!/usr/bin/env node

/**
 * AI-powered feedback generator.
 * Takes the bug checker scorecard and axe audit results,
 * then uses Vertex AI (Gemini) to produce a Pokemon-themed PR comment.
 *
 * Usage: node scripts/generate-report.mjs <scorecard.json> [axe-report.json]
 * Output: Markdown PR comment to stdout
 *
 * Requires GCP_PROJECT_ID and GCP_LOCATION env vars (or defaults).
 * Requires application default credentials or GOOGLE_APPLICATION_CREDENTIALS.
 */

import { readFileSync } from "fs";
import { VertexAI } from "@google-cloud/vertexai";

const scorecardPath = process.argv[2];
const axeReportPath = process.argv[3];
const previewUrl = process.argv[4]; // optional: Vercel preview URL for A11yDex link

if (!scorecardPath) {
  console.error(
    "Usage: node scripts/generate-report.mjs <scorecard.json> [axe-report.json]"
  );
  process.exit(1);
}

const scorecard = JSON.parse(readFileSync(scorecardPath, "utf-8"));
const axeReport = axeReportPath
  ? JSON.parse(readFileSync(axeReportPath, "utf-8"))
  : null;

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

async function generateNarrative(scorecard) {
  const project = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || "europe-west2";

  if (!project) {
    return "> *Professor A11y is unavailable — GCP_PROJECT_ID not configured.*\n";
  }

  const vertexAI = new VertexAI({ project, location });
  const model = vertexAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

  const caught = scorecard.results.filter((r) => r.fixed === true);
  const remaining = scorecard.results.filter((r) => r.fixed === false);

  const prompt = `You are Professor A11y, a friendly accessibility expert who makes subtle Pokemon references.

Write a short (3-5 sentence) encouraging progress report for a developer working on an accessibility exercise.

They have fixed ${caught.length} out of ${scorecard.total} accessibility bugs.

${remaining.length > 0 ? `The remaining bugs are: ${remaining.map((r) => `${r.name} (WCAG ${r.wcag})`).join(", ")}.` : "They have fixed all the bugs!"}

${remaining.length > 0 ? `Pick 2-3 of the remaining bugs and give brief, actionable hints for fixing them.` : `Congratulate them warmly.`}

Keep the tone encouraging and professional. Use one or two subtle Pokemon references (catching bugs, evolving skills, etc). Do not use emoji.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return `### Professor A11y Says:\n\n> ${text.split("\n").join("\n> ")}\n`;
  } catch (err) {
    return `### Professor A11y Says:\n\n> *Could not generate narrative: ${err.message}*\n`;
  }
}

function buildA11yDexLink(scorecard, previewUrl) {
  if (!previewUrl || !previewUrl.startsWith("http")) return "";
  const base = previewUrl.replace(/\/$/, "");
  const caught = scorecard.results.filter((r) => r.fixed === true);
  const path =
    caught.length > 0
      ? `/a11ydex?caught=${caught.map((r) => r.id).join(",")}`
      : "/a11ydex";
  return `\n\n[📖 View your A11yDex progress](${base}${path})\n`;
}

async function main() {
  let markdown = buildScorecardMarkdown(scorecard);
  const narrative = await generateNarrative(scorecard);
  markdown += narrative;

  if (previewUrl) {
    markdown += buildA11yDexLink(scorecard, previewUrl);
  }

  console.log(markdown);
}

main();
