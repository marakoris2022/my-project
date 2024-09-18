"use client";

import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "@/app/_customHooks/useAuth";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/app/_firebase/clientFirestireApi";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [fetchedData, setFetchedData] = useState<
    Record<string, string> | null | undefined
  >(undefined);

  useEffect(() => {
    if (user) {
      (async () => {
        const res = await fetchUserData(user.uid);
        setFetchedData(res ? res[0] : null);
      })();
    }
  }, [user]);

  if (loading || fetchedData === undefined) {
    return <Typography>Loading...</Typography>; // Показываем индикатор загрузки
  }

  if (!fetchedData)
    return (
      <Box sx={{ backgroundColor: "lightgray", height: "100vh" }}>
        <Container>
          <Box>
            <Typography>Something wrong.</Typography>
            <Typography>Cant get user Data.</Typography>
          </Box>
        </Container>
      </Box>
    );

  return (
    <Box sx={{ backgroundColor: "lightgray", height: "100vh" }}>
      <Container>
        <Box>
          <Typography>ProfilePage</Typography>
        </Box>
        <Box>
          <Typography>
            {Boolean(fetchedData["chosenPokemon"])
              ? "Pokemon is set!"
              : "You need to choose Pokemon."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
