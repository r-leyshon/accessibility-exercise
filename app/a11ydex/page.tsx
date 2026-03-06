import { Suspense } from "react";
import a11ymon from "@/data/a11ymon.json";
import A11ydexClient from "@/components/A11ydexClient";

export const dynamic = "force-dynamic";

export default function A11yDexPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        fontFamily: "'Comic Sans MS', cursive",
        color: "#e0e0e0",
      }}
    >
      <Suspense
        fallback={
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "#d1d5db",
            }}
          >
            Loading A11yDex…
          </div>
        }
      >
        <A11ydexClient
          a11ymon={
            a11ymon as Array<{
              id: number;
              name: string;
              wcag: string;
              principle: string;
              description: string;
              file: string;
              hint: string;
              wcagUrl?: string;
              detection?: { type: string };
            }>
          }
        />
      </Suspense>
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          color: "#d1d5db",
          fontSize: "13px",
          borderTop: "1px solid #333",
        }}
      >
        A11yDex &mdash; Accessibility Workshop Exercise &mdash; {a11ymon.length}{" "}
        A11ymon catalogued
      </footer>
    </div>
  );
}
