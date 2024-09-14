"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  async function handleClick() {
    try {
      await fetch("api/sign-out", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/");
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <Box>
      <Button onClick={handleClick}>Sign Out</Button>
    </Box>
  );
}
