"use client";


export default function Footer() {
  return (
    <div
      style={{
        padding: "16px 48px",
        backgroundColor: "#fffde7",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span style={{ color: "#999", fontSize: "13px" }}>
          © 2025 A11yDex Workshop
        </span>
        <span style={{ color: "#aaa", fontSize: "12px" }}>
          Training exercise
        </span>
        <span style={{ color: "#999", fontSize: "11px" }}>
          Not for production use
        </span>
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="#" style={{ color: "#999", fontSize: "11px" }}>
          Privacy
        </a>
        <a href="#" style={{ color: "#aaa", fontSize: "10px" }}>
          Terms
        </a>
        <span style={{ color: "#bbb", fontSize: "10px" }}>
          v1.0
        </span>
        <span style={{ color: "#999", fontSize: "10px" }}>
          Help
        </span>
      </div>
    </div>
  );
}
