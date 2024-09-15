import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
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
        Welcome traveler!
      </Typography>
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
    </Box>
  );
}
