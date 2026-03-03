import type { Metadata } from "next";
import "./globals.css";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Langless Larvitar (3.1.1): <html> missing lang attribute
 * - Titleless Togepi (2.4.2): generic page title
 * - Skipless Skarmory (2.4.1): no skip-to-content link
 */

export const metadata: Metadata = {
  // BUG: Titleless Togepi - generic unhelpful title
  title: "page",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // BUG: Langless Larvitar - missing lang attribute
    // BUG: Skipless Skarmory - no skip-to-content link anywhere
    <html>
      <body>{children}</body>
    </html>
  );
}
