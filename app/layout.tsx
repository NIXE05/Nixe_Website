import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIXE — Engineering trust into intelligent systems",
  description:
    "Boutique cybersecurity, AI, and applied software consulting — for teams who'd rather build it right the first time.",
  metadataBase: new URL("https://nixe.in"),
  openGraph: {
    title: "NIXE — Engineering trust into intelligent systems",
    description:
      "Boutique cybersecurity, AI, and applied software consulting based in Markham, Ontario.",
    url: "https://nixe.in",
    siteName: "NIXE",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIXE",
    description: "Boutique cybersecurity, AI, and applied software consulting.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
