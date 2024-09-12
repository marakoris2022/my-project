import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My own Project",
  description: "I made this project for my education",
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
