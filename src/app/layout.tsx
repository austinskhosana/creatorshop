import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Creatorshop",
  description: "Pay for products through your content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/*
        The body is a flex row — Sidebar on the left, page content on the right.
        h-full ensures it fills the screen height.
      */}
      <body className="flex h-full">
        <Sidebar />
        {/* flex-1 makes the main content area take up all remaining horizontal space */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
