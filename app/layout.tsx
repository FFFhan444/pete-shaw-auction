import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "Pete Shaw Memorial Golf Day 2026 — Charity Auction",
  description: "Charity auction for The Pete Shaw Memorial Golf Day 2026. Raising funds for Woking Hospice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${crimsonText.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
