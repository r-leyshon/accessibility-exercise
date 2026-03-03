import type { Metadata } from "next";
import "./globals.css";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Langless Larvitar (3.1.1): <html> missing lang attribute
 * - Titleless Togepi (2.4.2): generic page title
 * - Skipless Skarmory (2.4.1): no skip-to-content link
 */

export const metadata: Metadata = {
  title: "A11yDex - Accessibility Chat Assistant",
  description: "Find and fix accessibility bugs in this chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
