#!/usr/bin/env node

/**
 * Run the full accessibility audit locally.
 * Requires the dev server to be running at http://localhost:3000.
 *
 * Usage: npm run audit:local
 *
 * In one terminal: npm run dev
 * In another:      npm run audit:local
 */

import { spawn } from "child_process";
import { createWriteStream, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const LOCAL_URL = "http://localhost:3000";
const scorecardPath = resolve(projectRoot, "scorecard.json");
const axeReportPath = resolve(projectRoot, "axe-report.json");
const reportPath = resolve(projectRoot, "report.md");

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return true;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function run() {
  console.log("🔍 A11yDex local audit\n");

  // 1. Run bug pattern checker
  console.log("1. Running bug pattern checker...");
  const checkBugs = spawn("node", ["scripts/check-bugs.mjs"], {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "inherit"],
  });
  const scorecardStream = createWriteStream(scorecardPath);
  checkBugs.stdout.pipe(scorecardStream);
  await new Promise((resolve, reject) => {
    checkBugs.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`check-bugs exited ${code}`))));
  });
  await new Promise((r) => scorecardStream.end(r));
  const scorecard = JSON.parse(readFileSync(scorecardPath, "utf-8"));
  console.log(`   Score: ${scorecard.score}\n`);

  // 2. Ensure dev server is up (start if needed)
  console.log("2. Checking for dev server at", LOCAL_URL, "...");
  let devServer = null;
  const serverUp = await waitForServer(LOCAL_URL);
  if (!serverUp) {
    console.log("   Starting dev server...");
    devServer = spawn("npm", ["run", "dev"], {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const ready = await waitForServer(LOCAL_URL, 60);
    if (!ready) {
      devServer?.kill();
      console.error("\n❌ Dev server failed to start in time.");
      process.exit(1);
    }
    console.log("   Server is up.\n");
  } else {
    console.log("   Server is up.\n");
  }

  // 3. Ensure Playwright Chromium is installed
  console.log("3. Ensuring Playwright Chromium is installed...");
  await new Promise((resolve) => {
    const proc = spawn("npx", ["playwright", "install", "chromium"], {
      cwd: projectRoot,
      stdio: "inherit",
    });
    proc.on("close", (code) => resolve());
  });
  console.log("");

  // 4. Run axe-core audit
  console.log("4. Running axe-core audit...");
  try {
    const { chromium } = await import("playwright");
    const { AxeBuilder } = await import("@axe-core/playwright");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(LOCAL_URL, { waitUntil: "networkidle", timeout: 30000 });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa", "best-practice"])
        .analyze();

      const report = {
        url: LOCAL_URL,
        timestamp: new Date().toISOString(),
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          helpUrl: v.helpUrl,
          wcagTags: v.tags.filter((t) => t.startsWith("wcag") || t.startsWith("best-practice")),
          nodes: v.nodes.length,
        })),
        passes: results.passes.length,
        violationCount: results.violations.length,
        incompleteCount: results.incomplete.length,
      };
      writeFileSync(axeReportPath, JSON.stringify(report, null, 2));
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("   axe-core audit failed:", err.message);
    console.error("   (You'll still get the bug pattern checker results below.)\n");
  }

  // 5. Generate report
  console.log("5. Generating report...");
  const axePath = existsSync(axeReportPath) ? axeReportPath : "";
  const generateReport = spawn(
    "node",
    ["scripts/generate-report.mjs", scorecardPath, axePath, LOCAL_URL, "local"],
    { cwd: projectRoot, stdio: ["ignore", "pipe", "inherit"] }
  );
  const reportStream = createWriteStream(reportPath);
  generateReport.stdout.pipe(reportStream);
  await new Promise((resolve, reject) => {
    generateReport.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`generate-report exited ${code}`))));
  });
  await new Promise((r) => reportStream.end(r));

  if (devServer) {
    devServer.kill("SIGTERM");
  }

  console.log("\n✅ Audit complete. Report written to report.md:\n");
  console.log(readFileSync(reportPath, "utf-8"));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
