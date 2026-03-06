"use client";

import { useState, useEffect } from "react";

const tips = [
  "Did you know? 1 in 5 people in the UK have a disability.",
  "WCAG stands for Web Content Accessibility Guidelines.",
  "Screen readers rely on semantic HTML to navigate pages.",
  "Colour contrast of at least 4.5:1 is required for normal text.",
  "All interactive elements must be keyboard accessible.",
  "The GDS requires all public sector sites to meet WCAG 2.2 AA.",
  "Always provide text alternatives for non-text content.",
  "Focus indicators help keyboard users see where they are on a page.",
];

export default function ScrollingTicker() {
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const shouldAnimate = !paused && !prefersReducedMotion;
  const tickerText = tips.join("  ★  ");

  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "#333",
        padding: "6px 0",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            animation: shouldAnimate ? "ticker-animation 30s linear infinite" : "none",
            color: "#e5e5e5",
            fontSize: "13px",
            fontFamily: "'Comic Sans MS', cursive",
          }}
        >
          {tickerText}
          &nbsp;&nbsp;&nbsp;&nbsp;
          {tickerText}
        </div>
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Resume scrolling" : "Pause scrolling"}
            style={{
              padding: "4px 8px",
              fontSize: "13px",
              backgroundColor: "#555",
              color: "#fff",
              border: "1px solid #666",
              borderRadius: "4px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
