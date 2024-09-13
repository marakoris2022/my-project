import type { Metadata } from "next";
import "./globals.css";
import { Container } from "@mui/material";
import Header from "./_components/Header";

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
      <body>
        <Container>
          <Header />
          {children}
        </Container>
      </body>
    </html>
  );
}
