import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy · Clavis",
  description:
    "How NIXE Labs collects, uses and protects data in the Clavis hotel operating system, including hotel, staff and guest data processed on behalf of hotels.",
  robots: { index: true, follow: true },
};

export default function ClavisPrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
