"use client";

import { Box, Typography } from "@mui/material";
import PokemonProfilePage from "@/app/_components/ProfilePage";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  if (!fetchedData)
    return (
      <Box>
        <Typography>Something went wrong.</Typography>
        <Typography>{`Can't get user data.`}</Typography>
      </Box>
    );

  return (
    <Box>
      {Boolean(fetchedData["pokemonActive"]) && (
        <PokemonProfilePage pokemon={fetchedData} />
      )}
    </Box>
  );
}
