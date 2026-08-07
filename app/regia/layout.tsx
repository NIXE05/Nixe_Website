import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Regia · Run the venue, not the paperwork",
  description:
    "Regia is a venue management system for marriage halls and event venues. Bookings, advances, itemised billing, expenses, deposits and reporting in one place. By NIXE.",
  openGraph: {
    title: "Regia · Run the venue, not the paperwork",
    description:
      "Venue management for marriage halls and event venues: bookings and calendar, advance payments, itemised billing with PDF export, expenses, bank deposits and a live financial dashboard.",
    url: "https://nixe.in/regia",
    siteName: "Regia · NIXE",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regia · Run the venue, not the paperwork",
    description: "Venue management for marriage halls and event venues. By NIXE.",
  },
};

export default function RegiaLayout({ children }: { children: ReactNode }) {
  return children;
}
