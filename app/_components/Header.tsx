"use client";

import { Box, Button, CircularProgress, Container } from "@mui/material";
import Link from "next/link";
import { useAuth } from "../_customHooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../_firebase/firebaseConfig";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HouseIcon from "@mui/icons-material/House";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

export default function Header() {
  const { user, loading } = useAuth();

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "lightblue",
          borderBottom: "2px solid darkgray",
        }}
      >
        <Container
          sx={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "15px" }}>
            <CircularProgress size={20} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{ backgroundColor: "lightblue", borderBottom: "2px solid darkgray" }}
    >
      <Container
        sx={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: "15px" }}>
          {user ? (
            <>
              <Link href={"/"}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<HouseIcon />}
                >
                  Main
                </Button>
              </Link>
              <Link href={"/encyclopedia/1"}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<LibraryBooksIcon />}
                >
                  Encyclopedia
                </Button>
              </Link>
              <Link href={"/profile"}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<AssignmentIndIcon />}
                >
                  Profile
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="contained"
                size="small"
                endIcon={<MeetingRoomIcon />}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<HowToRegIcon />}
                >
                  Sign In
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<AddReactionIcon />}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
