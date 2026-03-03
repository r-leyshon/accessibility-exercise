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
        <span style={{ color: "#4a4a4a", fontSize: "14px" }}>
          © 2025 A11yDex Workshop
        </span>
        <span style={{ color: "#525252", fontSize: "13px" }}>
          Training exercise
        </span>
        <span style={{ color: "#565656", fontSize: "12px" }}>
          Not for production use
        </span>
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="#" style={{ color: "#525252", fontSize: "12px" }}>
          Privacy
        </a>
        <a href="#" style={{ color: "#565656", fontSize: "12px" }}>
          Terms
        </a>
        <span style={{ color: "#5a5a5a", fontSize: "12px" }}>
          v1.0
        </span>
        <span style={{ color: "#525252", fontSize: "12px" }}>
          Help
        </span>
      </div>
    </div>
  );
}
