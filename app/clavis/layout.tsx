import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Clavis — The Key to running it all, Intelligently",
  description:
    "Clavis is an AI-native hotel operating system — it runs reservations, billing, housekeeping and guest messaging, and only interrupts you when a decision needs a human. By NIXE.",
  openGraph: {
    title: "Clavis — The Key to running it all, Intelligently",
    description:
      "AI-native hotel PMS: reservations, channel manager, WhatsApp guest comms, GST-ready billing, housekeeping and multi-property intelligence in one platform.",
    url: "https://nixe.in/clavis",
    siteName: "Clavis · NIXE",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/apps/clavis/wordmark-hd.png",
        alt: "Clavis — an AI-native hotel operating system by NIXE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clavis — The Key to running it all, Intelligently",
    description: "An AI-native hotel operating system. By NIXE.",
    images: ["/apps/clavis/wordmark-hd.png"],
  },
};

export default function ClavisLayout({ children }: { children: ReactNode }) {
  return children;
}
