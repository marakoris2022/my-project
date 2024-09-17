"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/_firebase/firebaseConfig";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/"); // Переход на страницу входа
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Очистка подписки
  }, [router]);

  if (loading) {
    return <Typography>Loading...</Typography>; // Показываем индикатор загрузки
  }

  return (
    <Box>
      <Typography>ProfilePage</Typography>
    </Box>
  );
}
