#!/usr/bin/env node

/**
 * Accessibility audit runner.
 * Uses Playwright + axe-core to audit a deployed site URL.
 *
 * Usage: node scripts/audit.mjs <url>
 * Output: JSON report to stdout
 */

import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const url = process.argv[2];
const bypassSecret = process.env.VERCEL_PROTECTION_BYPASS_SECRET;

if (!url) {
  console.error("Usage: node scripts/audit.mjs <url>");
  process.exit(1);
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  if (bypassSecret) {
    context.setExtraHTTPHeaders({
      "x-vercel-protection-bypass": bypassSecret,
      "x-vercel-set-bypass-cookie": "true",
    });
  }

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa", "best-practice"])
      .analyze();

    const report = {
      url,
      timestamp: new Date().toISOString(),
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        wcagTags: v.tags.filter(
          (t) => t.startsWith("wcag") || t.startsWith("best-practice")
        ),
        nodes: v.nodes.length,
      })),
      passes: results.passes.length,
      violationCount: results.violations.length,
      incompleteCount: results.incomplete.length,
    };

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Audit failed:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
