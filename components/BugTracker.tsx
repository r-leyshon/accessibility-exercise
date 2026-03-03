"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Contrast Cubone (1.4.3): low contrast text
 * - Landmarkless Lapras (1.3.1): no semantic markup, uses <div> for everything
 * - Heading Haunter (1.3.1): uses <h5> after <h3> (skipped from <h1>)
 */

export default function BugTracker() {
  const searchParams = useSearchParams();
  const prKey = searchParams.get("pr_key");
  const [caught, setCaught] = useState<number | null>(null);

  useEffect(() => {
    const url = new URL("/api/score", window.location.origin);
    if (prKey) url.searchParams.set("pr_key", prKey);
    fetch(url.toString(), { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { caught: [] }))
      .then((data: { caught?: number[] }) => {
        const ids = (data.caught ?? []).filter((n) => typeof n === "number" && n >= 1 && n <= 25);
        setCaught(ids.length);
      })
      .catch(() => setCaught(null));
  }, [prKey]);

  const href = prKey ? `/a11ydex?pr_key=${encodeURIComponent(prKey)}` : "/a11ydex";

  return (
    <Link
      href={href}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        backgroundColor: "#dc2626",
        color: "#fca5a5",
        // BUG: Contrast Cubone - #fca5a5 on #dc2626 ≈ 2.3:1
        padding: "12px 16px",
        borderRadius: "12px",
        border: "3px solid #333",
        fontFamily: "'Comic Sans MS', cursive",
        fontSize: "13px",
        zIndex: 100,
        boxShadow: "4px 4px 0 #333",
        width: "180px",
        transform: "rotate(2deg)",
        display: "block",
        textDecoration: "none",
        cursor: "pointer",
        transition: "transform 0.15s",
      }}
    >
      {/* BUG: Heading Haunter - heading level skip */}
      <h5
        style={{
          margin: "0 0 4px 0",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#fca5a5",
        }}
      >
        A11yDex
      </h5>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        {caught !== null ? `${caught} / 25` : "… / 25"}
      </div>
      <div style={{ fontSize: "10px", marginTop: "2px" }}>
        A11ymon caught
      </div>
    </Link>
  );
}
