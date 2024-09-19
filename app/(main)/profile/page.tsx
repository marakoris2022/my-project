"use client";

import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "@/app/_customHooks/useAuth";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/app/_firebase/clientFirestireApi";
import ItemCarousel from "@/app/_components/ItemCarousel";
import {
  getPokemonListByExp,
  PokemonProfileProps,
} from "@/app/_pokemonApi/pokemonDataApi";
import PokemonCard from "@/app/_components/PokemonCard";
import PokemonProfilePage from "@/app/_components/ProfilePage";
import StaticBackdrop from "@/app/_components/StaticBackdrop";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [fetchedData, setFetchedData] = useState<
    PokemonProfileProps | null | undefined
  >(undefined);
  const pokemonDataList = getPokemonListByExp("inc").slice(0, 15);

  useEffect(() => {
    if (user) {
      (async () => {
        const res = await fetchUserData(user.uid);
        setFetchedData(res ? res : null);
      })();
    }
  }, [user]);

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
      {Boolean(fetchedData["chosenPokemon"]) ? (
        <PokemonProfilePage pokemon={fetchedData} />
      ) : (
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
