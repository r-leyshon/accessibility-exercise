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
        {/* BUG: Decorative Diglett - decorative image not hidden from assistive tech */}
        <img src="/pokeball.svg" width={40} height={40} />

        {/* BUG: Imagey Igglybuff - title as image of text instead of real text */}
        {/* BUG: Altless Abra - missing alt attribute */}
        <img src="/header-text.svg" width={200} height={40} />
      </div>

      {/* BUG: Heading Haunter - skips from h1 (implied) to h3 */}
      <h3
        style={{
          color: "#999",
          fontSize: "14px",
          fontWeight: "normal",
          margin: 0,
        }}
      >
        Gotta Fix &apos;Em All!
      </h3>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {/* BUG: Vague Vulpix - vague link text */}
        <a
          href="/gallery"
          style={{ color: "#999", fontSize: "13px" }}
          tabIndex={5}
        >
          Click here
        </a>

        {/* BUG: Linkless Ledyba - empty link */}
        <a href="#"></a>
      </div>
    </div>
  );
}
