"use client";

import { useState, useRef, useEffect } from "react";

export default function Disclaimer() {
  const [visible, setVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = () => {
    setDropdownOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dropdownOpen]);

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
      <p style={{ margin: "0 0 8px 0", lineHeight: "1.4" }}>
        This website is <strong>intentionally designed with poor accessibility
        and bad UI patterns</strong> as a training exercise. Your mission: identify
        and fix as many accessibility issues as possible to make it WCAG 2.2 AA
        compliant. Think of it as catching bugs in the wild!
      </p>

      <div style={{ display: "inline-block", position: "relative" }}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          style={{
            padding: "4px 8px",
            border: "1px solid #856404",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "transparent",
            color: "inherit",
            fontFamily: "inherit",
          }}
        >
          More info ▼
        </button>
        {dropdownOpen && (
          <div
            role="menu"
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
              fontSize: "13px",
            }}
          >
            <div role="menuitem" style={{ padding: "4px 0" }}>
              What is WCAG 2.2?
            </div>
            <div role="menuitem" style={{ padding: "4px 0" }}>
              GDS accessibility requirements
            </div>
            <div role="menuitem" style={{ padding: "4px 0" }}>
              Tools for testing
            </div>
          </div>
        )}
      </div>

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
          color: "#856404",
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
