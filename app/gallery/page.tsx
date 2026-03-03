/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

/**
 * Gallery page — INTENTIONALLY ACCESSIBLE.
 * This page is NOT part of the exercise. It showcases submissions from access-audit branches.
 *
 * INTENTIONAL ACCESSIBILITY BUG (Inconsistent Ivysaur):
 * Navigation order is reversed compared to the main page header.
 */

interface Deployment {
  uid: string;
  url: string;
  meta?: {
    githubCommitRef?: string;
    githubCommitAuthorLogin?: string;
  };
  createdAt: number;
}

async function getSubmissions() {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return [];
  }

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=preview&limit=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) return [];

    const { deployments } = (await res.json()) as {
      deployments: Deployment[];
    };

    const submissions = new Map<
      string,
      { username: string; url: string; createdAt: number }
    >();

    for (const d of deployments) {
      const ref = d.meta?.githubCommitRef ?? "";
      if (!ref.startsWith("access-audit/")) continue;

      const username =
        d.meta?.githubCommitAuthorLogin ?? ref.replace("access-audit/", "");
      if (!submissions.has(username)) {
        submissions.set(username, {
          username,
          url: `https://${d.url}`,
          createdAt: d.createdAt,
        });
      }
    }

    return Array.from(submissions.values());
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const submissions = await getSubmissions();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <header
        style={{
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: "24px 32px",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* BUG: Inconsistent Ivysaur - nav order is reversed vs main page */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              Back to A11yDex
            </Link>
          </div>
          <h1 style={{ fontSize: "24px", margin: 0, fontWeight: 700 }}>
            A11yDex Gallery
          </h1>
        </nav>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "8px", color: "#1e293b" }}>
          Submissions
        </h2>
        <p
          style={{
            color: "#475569",
            marginBottom: "32px",
            fontSize: "16px",
            lineHeight: 1.6,
          }}
        >
          Each card links to an accessibility-improved version of the A11yDex
          chat app. Click a card to view the deployed site.
        </p>

        {submissions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 32px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>
              🎒
            </p>
            <p>No submissions yet.</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Submissions will appear here when PRs are opened from{" "}
              <code
                style={{
                  backgroundColor: "#e2e8f0",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                access-audit/&lt;username&gt;
              </code>{" "}
              branches.
            </p>
          </div>
        ) : (
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {submissions.map((submission) => (
              <li key={submission.username}>
                <a
                  href={submission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "24px",
                    textDecoration: "none",
                    color: "#1e293b",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    <img
                      src={`https://github.com/${submission.username}.png`}
                      alt={`${submission.username}'s GitHub avatar`}
                      width={48}
                      height={48}
                      style={{ borderRadius: "50%" }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                        }}
                      >
                        {submission.username}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                        }}
                      >
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#2563eb",
                      fontWeight: 500,
                    }}
                  >
                    View submission →
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          color: "#94a3b8",
          fontSize: "13px",
          borderTop: "1px solid #e2e8f0",
          marginTop: "64px",
        }}
      >
        <p>A11yDex — Gotta Fix &apos;Em All! — Accessibility Workshop</p>
      </footer>
    </div>
  );
}
