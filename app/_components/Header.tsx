import { Box } from "@mui/material";
import Link from "next/link";
import SignOut from "./SignOut";

export default function Header() {
  return (
    <Box>
      <Link href={"/"}>Main</Link>
      <Link href={"/profile"}>Profile</Link>
      <SignOut />
    </Box>
  );
}
