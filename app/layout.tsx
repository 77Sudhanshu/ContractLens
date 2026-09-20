import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractLens — AI Contract Intelligence",
  description:
    "AI-powered contract intelligence for understanding agreements, tracking obligations and comparing contract versions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}