import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Courtly",
  description:
    "How Courtly (by NIXE Labs) collects, uses, and shares your information. GDPR / CCPA / DPDP compliant.",
  robots: { index: true, follow: true },
};

export default function CourtlyPrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
