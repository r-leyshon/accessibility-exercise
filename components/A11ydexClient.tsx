"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import A11ymonImage from "@/components/A11ymonImage";

export interface A11ymonBug {
  id: number;
  name: string;
  wcag: string;
  principle: string;
  description: string;
  file: string;
  hint: string;
  wcagUrl?: string;
  detection?: { type: string };
}

const principleColours: Record<string, { bg: string; border: string; badge: string }> = {
  Perceivable: { bg: "#fff0f0", border: "#e57373", badge: "#c62828" },
  Operable: { bg: "#f0f4ff", border: "#64b5f6", badge: "#1565c0" },
  Understandable: { bg: "#f0fff0", border: "#81c784", badge: "#2e7d32" },
  Robust: { bg: "#fff8e1", border: "#ffb74d", badge: "#e65100" },
};

function getA11ymonImageSrc(id: number): string {
  return `/a11ymon/${String(id).padStart(2, "0")}.png`;
}

const MANUAL_VERIFIED_KEY = "a11ydex-manual-verified";

function getManualVerifiedIds(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(MANUAL_VERIFIED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export default function A11ydexClient({ a11ymon }: { a11ymon: A11ymonBug[] }) {
  const searchParams = useSearchParams();
  const prKey = searchParams.get("pr_key");
  const [caughtIds, setCaughtIds] = useState<Set<number>>(new Set());
  const [manualVerifiedIds, setManualVerifiedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setManualVerifiedIds(getManualVerifiedIds());
  }, []);

  const toggleManualVerified = (id: number) => {
    setManualVerifiedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(MANUAL_VERIFIED_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  useEffect(() => {
    const url = new URL("/api/score", window.location.origin);
    if (prKey) url.searchParams.set("pr_key", prKey);
    fetch(url.toString(), { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { caught: [] }))
      .then((data: { caught?: number[] }) => {
        const ids = (data.caught ?? []).filter(
          (n): n is number => typeof n === "number" && n >= 1 && n <= 25
        );
        setCaughtIds(new Set(ids));
      })
      .catch(() => setCaughtIds(new Set()));
  }, [prKey]);

  const grouped = {
    Perceivable: a11ymon.filter((b) => b.principle === "Perceivable"),
    Operable: a11ymon.filter((b) => b.principle === "Operable"),
    Understandable: a11ymon.filter((b) => b.principle === "Understandable"),
    Robust: a11ymon.filter((b) => b.principle === "Robust"),
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#dc2626",
          padding: "16px 24px",
          borderBottom: "4px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            A11yDex
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: "#fca5a5",
            }}
          >
            Gotta Fix &apos;Em All! &mdash;{" "}
            {caughtIds.size > 0 ? (
              <>
                <strong>
                  {caughtIds.size} / {a11ymon.length}
                </strong>{" "}
                A11ymon caught
              </>
            ) : (
              <>{a11ymon.length} A11ymon to catch</>
            )}
          </p>
        </div>
        <Link
          href={prKey ? `/?pr_key=${encodeURIComponent(prKey)}` : "/"}
          style={{
            color: "#fca5a5",
            fontSize: "14px",
            textDecoration: "underline",
          }}
        >
          Back to chat
        </Link>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
        {Object.entries(grouped).map(([principle, bugs]) => {
          const colours = principleColours[principle];
          return (
            <section key={principle} style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  color: colours.badge,
                  borderBottom: `2px solid ${colours.border}`,
                  paddingBottom: "8px",
                  marginBottom: "16px",
                }}
              >
                {principle}
                <span
                  style={{
                    fontSize: "13px",
                    marginLeft: "8px",
                    color: "#999",
                    fontWeight: "normal",
                  }}
                >
                  WCAG{" "}
                  {principle === "Perceivable"
                    ? "1.x"
                    : principle === "Operable"
                      ? "2.x"
                      : principle === "Understandable"
                        ? "3.x"
                        : "4.x"}
                </span>
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "16px",
                }}
              >
                {bugs.map((bug) => (
                  <div
                    key={bug.id}
                    style={{
                      backgroundColor: colours.bg,
                      border: `2px solid ${colours.border}`,
                      borderRadius: "12px",
                      padding: "16px",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <A11ymonImage
                        src={getA11ymonImageSrc(bug.id)}
                        alt={`${bug.name} — accessibility bug`}
                        id={bug.id}
                        caught={
                          caughtIds.has(bug.id) ||
                          (bug.detection?.type === "manual" && manualVerifiedIds.has(bug.id))
                        }
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "12px",
                            fontSize: "36px",
                            fontWeight: "bold",
                            color: colours.border,
                            opacity: 0.15,
                            lineHeight: 1,
                            fontFamily: "monospace",
                          }}
                        >
                          #{String(bug.id).padStart(2, "0")}
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor: colours.badge,
                            color: "#fff",
                            fontSize: "10px",
                            padding: "2px 8px",
                            borderRadius: "99px",
                            fontWeight: "bold",
                            letterSpacing: "0.5px",
                            marginBottom: "8px",
                          }}
                        >
                          WCAG {bug.wcag}
                        </div>
                        <h3
                          style={{
                            margin: "0 0 6px",
                            fontSize: "16px",
                            color: "#222",
                            fontWeight: "bold",
                          }}
                        >
                          {bug.name}
                        </h3>
                      </div>
                    </div>

                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "13px",
                        color: "#444",
                        lineHeight: 1.5,
                      }}
                    >
                      {bug.description}
                    </p>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        borderTop: `1px solid ${colours.border}`,
                        paddingTop: "8px",
                        marginTop: "auto",
                      }}
                    >
                      <span style={{ fontWeight: "bold", color: "#555" }}>File:</span>{" "}
                      <code
                        style={{
                          backgroundColor: "rgba(0,0,0,0.06)",
                          padding: "1px 4px",
                          borderRadius: "3px",
                          fontSize: "11px",
                        }}
                      >
                        {bug.file}
                      </code>
                    </div>

                    <details
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      <summary
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          color: colours.badge,
                          fontSize: "12px",
                        }}
                      >
                        Hint
                      </summary>
                      <p
                        style={{
                          margin: "4px 0 0",
                          lineHeight: 1.5,
                          fontSize: "12px",
                        }}
                      >
                        {bug.hint}
                      </p>
                    </details>

                    {bug.detection?.type === "manual" && (
                      <div
                        style={{
                          marginTop: "12px",
                          paddingTop: "12px",
                          borderTop: `1px solid ${colours.border}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {bug.wcagUrl && (
                          <a
                            href={bug.wcagUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "12px",
                              color: colours.badge,
                              textDecoration: "underline",
                            }}
                          >
                            WCAG {bug.wcag} Understanding
                          </a>
                        )}
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: "#444",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={manualVerifiedIds.has(bug.id)}
                            onChange={() => toggleManualVerified(bug.id)}
                            aria-label={`Self-assess: ${bug.name} verified`}
                            style={{
                              width: "16px",
                              height: "16px",
                              accentColor: colours.badge,
                            }}
                          />
                          I&apos;ve verified this is fixed
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
