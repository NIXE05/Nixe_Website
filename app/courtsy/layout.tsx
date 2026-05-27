import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Courtsy — Game on. Tabs settled.",
  description:
    "iOS companion for court sports — log every match, split the booking, and watch your win rate, streaks, and rivalries grow with your crew. By NIXE.",
  openGraph: {
    title: "Courtsy — Game on. Tabs settled.",
    description:
      "iOS companion for racquet-sport groups: match logging, win-rate stats, expense splitting, RSVP-driven sessions.",
    url: "https://nixe.in/courtsy",
    siteName: "Courtsy · NIXE",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courtsy — Game on. Tabs settled.",
    description: "iOS companion for racquet-sport groups.",
  },
};

export default function CourtsyLayout({ children }: { children: ReactNode }) {
  return children;
}
