"use client";

import { Box } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <Box>
      <Link href={"/"}>Main</Link>
      <Link href={"/sign-in"}>SignIn</Link>
      <Link href={"/sign-up"}>SignUp</Link>
    </Box>
  );
}
