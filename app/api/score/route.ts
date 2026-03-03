import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return Response.json({ caught: [] });
  }

  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
  if (!host) {
    return Response.json({ caught: [] });
  }

  const deploymentUrl = `https://${host}`.replace(/\/$/, "");
  const prKeyFromQuery = req.nextUrl.searchParams.get("pr_key");
  const prKeyFromEnv =
    process.env.VERCEL_GIT_REPO_OWNER &&
    process.env.VERCEL_GIT_REPO_SLUG &&
    process.env.VERCEL_GIT_PULL_REQUEST_ID
      ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}#pr${process.env.VERCEL_GIT_PULL_REQUEST_ID}`
      : null;
  const prKey = prKeyFromQuery || prKeyFromEnv;

  try {
    const sql = neon(dbUrl);
    let rows: Array<{ caught?: unknown }> = [];

    // For PRs: prefer pr_key lookup (stable across redeploys)
    if (prKey) {
      rows = await sql`
        SELECT caught FROM deployment_scores
        WHERE pr_key = ${prKey}
      `;
    }

    // Fallback: lookup by deployment URL (production or legacy)
    if (!rows.length) {
      rows = await sql`
        SELECT caught FROM deployment_scores
        WHERE deployment_url = ${deploymentUrl}
      `;
    }

    const raw = rows[0]?.caught ?? [];
    const ids = Array.isArray(raw)
      ? raw.filter((n): n is number => typeof n === "number" && n >= 1 && n <= 25)
      : [];
    return Response.json({ caught: ids });
  } catch {
    return Response.json({ caught: [] });
  }
}
