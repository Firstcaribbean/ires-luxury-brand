import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.brandName,
  description:
    "Luxury perfume e-commerce concept with cinematic storytelling, WhatsApp booking, and delivery tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
