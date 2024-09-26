import { Box, Container } from "@mui/material";
import type { Metadata } from "next";

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
    <Box
      sx={{
        backgroundColor: "lightgray",
        height: "fit-content",
        minHeight: "100vh",
      }}
    >
      <Container>{children}</Container>
    </Box>
  );
}
