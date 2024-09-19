"use client";

import { Avatar, Box, Typography } from "@mui/material";
import ItemCarousel from "@/app/_components/ItemCarousel";
import { getPokemonListByExp } from "@/app/_pokemonApi/pokemonDataApi";
import PokemonCard from "@/app/_components/PokemonCard";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";

export default function ProfilePage() {
  const pokemonDataList = getPokemonListByExp("inc").slice(0, 15);
  const { loading, fetchedData } = usePokemonRedirect();

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  if (!fetchedData)
    return (
      <Box>
        <Typography>Something wrong.</Typography>
        <Typography>Cant get user Data.</Typography>
      </Box>
    );

  return (
    <Box>
      {!Boolean(fetchedData["chosenPokemon"]) && (
        <ItemCarousel
          mainTitle={"You need to choose Pokemon"}
          title1={"You like it?"}
          title2={"Dont forget to check next!"}
          bigItems={pokemonDataList.map((item, i) => (
            <PokemonCard key={i} pokemonData={item} />
          ))}
          smallItems={pokemonDataList.map((item, i) => (
            <Avatar
              key={i}
              alt={item.name}
              src={item.sprites.front_default}
              sx={{
                border: "1px solid azure",
                width: "70px",
                height: "70px",
              }}
            />
          ))}
        />
      )}
    </Box>
  );
}
