import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Realtime API Agents",
  description: "A demo app from Universidad UK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
