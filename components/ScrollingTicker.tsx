"use client";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Marquee Magikarp (2.2.2): auto-scrolling content with no pause/stop control
 * - Contrast Cubone (1.4.3): low contrast text
 */

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
  const tickerText = tips.join("  ★  ");

  return (
    // BUG: Marquee Magikarp - no pause/stop button, auto-scrolls forever
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
          display: "inline-block",
          animation: "scroll-ticker 30s linear infinite",
          // BUG: Contrast Cubone - #888 on #333 ≈ 3.0:1
          color: "#888",
          fontSize: "12px",
          fontFamily: "'Comic Sans MS', cursive",
        }}
      >
        {tickerText}
        &nbsp;&nbsp;&nbsp;&nbsp;
        {tickerText}
      </div>
    </div>
  );
}
