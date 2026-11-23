import type { Metadata } from "next";
import "./globals.css";
import { BrandProvider } from "@/brands/context";

export const metadata: Metadata = {
  title: "StudioPilot — Your Private Creative Command Centre",
  description:
    "A private, single-admin content production workspace for TECHENIGMASTUDIOS, AI That Works, and CONTXT AHEAD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased">
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  );
}
