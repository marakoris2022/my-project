"use client";

import { Box, Typography } from "@mui/material";
import PokemonProfilePage from "@/app/_components/ProfilePage";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { getPokemonListByNames } from "@/app/_pokemonApi/pokemonDataApi";
import PokemonEncyclopediaCard from "@/app/_components/PokemonEncyclopediaCard";

export default function ProfilePage() {
  const { loading, fetchedData, setFetchedData } = usePokemonRedirect();

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

  const pokemonDataList = getPokemonListByNames(fetchedData.caughtPokes);

  return (
    <Box>
      {Boolean(fetchedData["pokemonActive"]) && (
        <>
          <PokemonProfilePage
            setFetchedData={setFetchedData}
            pokemon={fetchedData}
          />

          <Typography
            variant="h5"
            sx={{ textAlign: "center", padding: "30px" }}
            gutterBottom
          >
            Your Pokémon Inventory
          </Typography>

          {pokemonDataList.map((item, i) => (
            <PokemonEncyclopediaCard key={`item.name_${i}`} pokemon={item} />
          ))}
        </>
      )}
    </Box>
  );
}
