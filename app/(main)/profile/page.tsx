"use client";

import { Box, Typography } from "@mui/material";
// import { useAuth } from "@/app/_customHooks/useAuth";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Import the useRouter hook
// import { fetchUserData } from "@/app/_firebase/clientFirestireApi";
// import { PokemonProfileProps } from "@/app/_pokemonApi/pokemonDataApi";
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
      {Boolean(fetchedData["chosenPokemon"]) && (
        <PokemonProfilePage pokemon={fetchedData} />
      )}
    </Box>
  );
}
