"use client";

import { Box, Typography } from "@mui/material";
import { useAuth } from "@/app/_customHooks/useAuth";

export default function ProfilePage() {
  const { loading } = useAuth();

  if (loading) {
    return <Typography>Loading...</Typography>; // Показываем индикатор загрузки
  }

  return (
    <Box>
      <Typography>ProfilePage</Typography>
    </Box>
  );
}
