#!/usr/bin/env node

/**
 * Custom A11ymon bug pattern checker.
 * Scans source files for known-bad patterns defined in data/a11ymon.json.
 *
 * Usage: node scripts/check-bugs.mjs
 * Output: JSON scorecard to stdout
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const bugs = JSON.parse(
  readFileSync(resolve(projectRoot, "data/a11ymon.json"), "utf-8")
);

function checkBug(bug) {
  if (bug.detection.type === "manual") {
    return { ...bug, status: "manual_check_required" };
  }

  if (bug.detection.type === "axe_rule") {
    return { ...bug, status: "checked_by_axe" };
  }

  if (bug.detection.type !== "code_pattern") {
    return { ...bug, status: "unknown_detection_type" };
  }

  const filePath = resolve(projectRoot, bug.file);
  let fileContent;

  try {
    fileContent = readFileSync(filePath, "utf-8");
  } catch {
    return { ...bug, status: "file_not_found", fixed: false };
  }

  const pattern = bug.detection.pattern;
  let patternFound;

  if (pattern.includes("\\s") || pattern.includes("\\d")) {
    const regex = new RegExp(pattern);
    patternFound = regex.test(fileContent);
  } else {
    patternFound = fileContent.includes(pattern);
  }

  return {
    id: bug.id,
    name: bug.name,
    wcag: bug.wcag,
    principle: bug.principle,
    description: bug.description,
    hint: bug.hint,
    fixed: !patternFound,
    status: patternFound ? "bug_present" : "likely_fixed",
  };
}

const results = bugs.map(checkBug);

const fixed = results.filter((r) => r.fixed === true).length;
const present = results.filter((r) => r.fixed === false).length;
const needsManual = results.filter(
  (r) => r.status === "manual_check_required" || r.status === "checked_by_axe"
).length;

const scorecard = {
  timestamp: new Date().toISOString(),
  total: bugs.length,
  fixed,
  present,
  needsManualCheck: needsManual,
  score: `${fixed} / ${bugs.length}`,
  results,
};

console.log(JSON.stringify(scorecard, null, 2));
