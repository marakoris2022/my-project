"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import SignOut from "./SignOut";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/_firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Link href={"/"}>Main</Link>
      <Link href={"/profile"}>Profile</Link>
      <SignOut />
    </Box>
  );
}
