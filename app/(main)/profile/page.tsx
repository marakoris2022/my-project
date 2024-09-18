"use client";

import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "@/app/_customHooks/useAuth";

export default function ProfilePage() {
  const { loading } = useAuth();

  if (loading) {
    return <Typography>Loading...</Typography>; // Показываем индикатор загрузки
  }

  return (
    <Box sx={{ backgroundColor: "lightgray", height: "100vh" }}>
      <Container>
        <Box>
          <Typography>ProfilePage</Typography>
        </Box>
      </Container>
    </Box>
  );
}
