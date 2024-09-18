"use client";

import { Avatar, Box, Container, Typography } from "@mui/material";
import { useAuth } from "@/app/_customHooks/useAuth";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/app/_firebase/clientFirestireApi";
import ItemCarousel from "@/app/_components/ItemCarousel";
import { getPokemonListByExp } from "@/app/_pokemonApi/pokemonDataApi";
import PokemonCard from "@/app/_components/PokemonCard";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [fetchedData, setFetchedData] = useState<
    Record<string, string> | null | undefined
  >(undefined);
  const pokemonDataList = getPokemonListByExp("inc").slice(0, 15);

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
          {Boolean(fetchedData["chosenPokemon"]) ? (
            <Typography>Pokemon is set!</Typography>
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
      </Container>
    </Box>
  );
}
