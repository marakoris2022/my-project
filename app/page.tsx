"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import StaticBackdrop from "./_components/StaticBackdrop"; // Компонент загрузки
import { usePokemonRedirect } from "./_customHooks/usePokemonRedirect";

export default function Home() {
  const { user, loading } = usePokemonRedirect();

  // Если загрузка данных пользователя еще идет, показываем компонент загрузки
  if (loading) {
    return <StaticBackdrop />; // Вернем компонент загрузки
  }

  return (
    <Box sx={{ backgroundColor: "lightgray", height: "100vh" }}>
      <Container>
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
            <>
              <Box sx={{ mb: "15px" }}>
                <Link href={"/profile"}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ background: "azure" }}
                  >
                    Profile
                  </Button>
                </Link>
              </Box>

              <Box sx={{ mb: "15px" }}>
                <Link href={"/training"}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ background: "azure" }}
                  >
                    Training
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ mb: "15px" }}>
                <Link href={"/sign-in"}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ background: "azure" }}
                  >
                    Sign In!
                  </Button>
                </Link>
              </Box>
              <Box sx={{ mb: "15px", background: "azure" }}>
                <Link href={"/sign-up"}>
                  <Button fullWidth variant="outlined">
                    Sign Up!
                  </Button>
                </Link>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
