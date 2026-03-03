/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
"use client";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Altless Abra (1.1.1): <img> missing alt attribute
 * - Decorative Diglett (1.1.1): pokeball image not hidden from AT
 * - Imagey Igglybuff (1.4.5): site title as image of text
 * - Heading Haunter (1.3.1): skipped heading levels (h1 -> h3)
 * - Landmarkless Lapras (1.3.1): no <header> landmark, uses <div>
 * - Vague Vulpix (2.4.4): "click here" link text
 * - Linkless Ledyba (4.1.2): empty <a> tag
 */

export default function Header() {
  return (
    // BUG: Landmarkless Lapras - using <div> instead of <header>
    <div
      style={{
        backgroundColor: "#7fff00",
        padding: "8px 48px 8px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        borderBottom: "3px solid #ff1493",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/pokeball.svg"
          width={40}
          height={40}
          alt=""
          aria-hidden="true"
        />
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            fontFamily: "'Comic Sans MS', cursive",
          }}
        >
          A11yDex
        </h1>
      </div>

      <h2
        style={{
          color: "#666",
          fontSize: "14px",
          fontWeight: "normal",
          margin: 0,
        }}
      >
        Gotta Fix &apos;Em All!
      </h2>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="/gallery" style={{ color: "#666", fontSize: "13px" }}>
          View gallery
        </a>
      </div>
    </div>
  );
}
