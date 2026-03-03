"use client";

import { useState } from "react";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Tiny Target Tyrogue (2.5.8): close button is 16x16px (below 24x24 minimum)
 * - Trapped Tangela (2.1.2): the dropdown traps keyboard focus
 */

export default function Disclaimer() {
  const [visible, setVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!visible) return null;

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffc107",
        padding: "12px 16px",
        margin: "0",
        position: "relative",
        fontSize: "13px",
        color: "#856404",
        fontFamily: "'Comic Sans MS', cursive",
      }}
    >
      <h5 style={{ margin: "0 0 6px 0", fontSize: "14px" }}>
        ⚠ Exercise Disclaimer
      </h5>
      <p style={{ margin: "0 0 8px 0", lineHeight: "1.4" }}>
        This website is <strong>intentionally designed with poor accessibility
        and bad UI patterns</strong> as a training exercise. Your mission: identify
        and fix as many accessibility issues as possible to make it WCAG 2.2 AA
        compliant. Think of it as catching bugs in the wild!
      </p>

      {/* BUG: Trapped Tangela - keyboard trap in custom dropdown */}
      <div style={{ display: "inline-block", position: "relative" }}>
        <div
          tabIndex={0}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }
            // BUG: no Escape handler to close, and focus is trapped
          }}
          style={{
            padding: "4px 8px",
            border: "1px solid #856404",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Learn more ▼
        </div>
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              zIndex: 10,
              width: "280px",
              fontSize: "12px",
            }}
          >
            {/* BUG: Trapped Tangela - these items receive focus but
                there is no way to tab out or close with Escape */}
            <div tabIndex={0} style={{ padding: "4px 0" }}>
              What is WCAG 2.2?
            </div>
            <div tabIndex={0} style={{ padding: "4px 0" }}>
              GDS accessibility requirements
            </div>
            <div tabIndex={0} style={{ padding: "4px 0" }}>
              Tools for testing
            </div>
          </div>
        )}
      </div>

      {/* BUG: Tiny Target Tyrogue - close button is 16x16px, below 24x24 minimum */}
      <div
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          width: "16px",
          height: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          color: "#856404",
          lineHeight: 1,
        }}
      >
        ✕
      </div>
    </div>
  );
}
