"use client";

import { Box, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../_firebase/firebaseConfig";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </Box>
  );
}
