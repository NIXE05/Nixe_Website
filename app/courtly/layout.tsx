import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Courtly — Game on. Tabs settled.",
  description:
    "iOS companion for court sports — log every match, split the booking, and watch your win rate, streaks, and rivalries grow with your crew. By NIXE.",
  openGraph: {
    title: "Courtly — Game on. Tabs settled.",
    description:
      "iOS companion for racquet-sport groups: match logging, win-rate stats, expense splitting, RSVP-driven sessions.",
    url: "https://nixe.in/courtly",
    siteName: "Courtly · NIXE",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courtly — Game on. Tabs settled.",
    description: "iOS companion for racquet-sport groups.",
  },
};

export default function CourtlyLayout({ children }: { children: ReactNode }) {
  return children;
}
