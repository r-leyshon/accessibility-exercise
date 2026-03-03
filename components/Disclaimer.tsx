"use client";

import { useState } from "react";

export default function Disclaimer() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffc107",
        padding: "12px 16px",
        margin: "0",
        position: "relative",
        fontSize: "14px",
        color: "#664d03",
        fontFamily: "'Comic Sans MS', cursive",
      }}
    >
      <h3 style={{ margin: "0 0 6px 0", fontSize: "14px" }}>
        ⚠ Exercise Disclaimer
      </h3>
      <p style={{ margin: 0, lineHeight: "1.4" }}>
        This website is <strong>intentionally designed with poor accessibility
        and bad UI patterns</strong> as a training exercise. Your mission: identify
        and fix as many accessibility issues as possible to make it WCAG 2.2 AA
        compliant. Think of it as catching bugs in the wild!{" "}
        <a
          href="https://www.w3.org/WAI/WCAG22/Understanding/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#664d03", textDecoration: "underline" }}
        >
          WCAG 2.2 Understanding docs
        </a>
      </p>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Close disclaimer"
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          minWidth: "24px",
          minHeight: "24px",
          width: "24px",
          height: "24px",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#664d03",
          lineHeight: 1,
          border: "none",
          backgroundColor: "transparent",
          fontFamily: "inherit",
        }}
      >
        ✕
      </button>
    </div>
  );
}
