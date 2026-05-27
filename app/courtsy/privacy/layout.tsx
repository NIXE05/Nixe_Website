import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Courtsy",
  description:
    "How Courtsy (by NIXE Labs) collects, uses, and shares your information. GDPR / CCPA / DPDP compliant.",
  robots: { index: true, follow: true },
};

export default function CourtsyPrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
