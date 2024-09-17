"use client";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import StaticBackdrop from "./_components/StaticBackdrop"; // Компонент загрузки
import { useAuth } from "./_customHooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  // Если загрузка данных пользователя еще идет, показываем компонент загрузки
  if (loading) {
    return <StaticBackdrop />; // Вернем компонент загрузки
  }

  return (
    <Box
      sx={{
        paddingTop: "20vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%",
        margin: "0 auto",
      }}
      component={"main"}
    >
      <Typography
        component={"h1"}
        sx={{ fontSize: "36px", fontWeight: "bold", mb: "30px" }}
      >
        {Boolean(user) ? `Welcome back!` : "Welcome traveler!"}
      </Typography>

      {Boolean(user) ? (
        <Box sx={{ mb: "15px" }}>
          <Link href={"/profile"}>
            <Button fullWidth variant="outlined">
              Profile
            </Button>
          </Link>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: "15px" }}>
            <Link href={"/sign-in"}>
              <Button fullWidth variant="outlined">
                Sign In!
              </Button>
            </Link>
          </Box>
          <Box sx={{ mb: "15px" }}>
            <Link href={"/sign-up"}>
              <Button fullWidth variant="outlined">
                Sign Up!
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
}
