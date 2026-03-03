import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A11yDex Gallery - Intern Submissions",
  description:
    "Browse accessibility-improved versions of the A11yDex chat app submitted by workshop participants.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
