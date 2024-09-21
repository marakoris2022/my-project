"use client";

import { Box, Typography } from "@mui/material";
import PokemonProfilePage from "@/app/_components/ProfilePage";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { getPokemonListByNames } from "@/app/_pokemonApi/pokemonDataApi";
import PokemonEncyclopediaCard from "@/app/_components/PokemonEncyclopediaCard";
import { useEffect, useState } from "react";
import { getUserData } from "@/app/_firebase/firestoreAPI";

export default function ProfilePage() {
  const { loading, fetchedData, setFetchedData } = usePokemonRedirect();
  const [regenerate, setRegenerate] = useState(false);

  useEffect(() => {
    let regenInterval: NodeJS.Timeout; // Для хранения идентификатора интервала

    if (fetchedData && fetchedData.currentHP < fetchedData.stats.hp) {
      setRegenerate(true);

      regenInterval = setInterval(async () => {
        const updatedData = await getUserData(fetchedData.userId);

        if (updatedData!.currentHP >= updatedData!.stats.hp) {
          clearInterval(regenInterval);
          setRegenerate(false);
          setFetchedData(updatedData);
        } else {
          setFetchedData(updatedData);
        }
      }, 5000);
    }

    return () => {
      clearInterval(regenInterval); // Очистка интервала при размонтировании
    };
  }, [fetchedData, regenerate]); // Убираем setFetchedData из зависимостей

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
          <PokemonProfilePage pokemon={fetchedData} />

          <Typography
            variant="h5"
            sx={{ textAlign: "center", padding: "30px" }}
            gutterBottom
          >
            Your Pokémon Inventory
          </Typography>

          {pokemonDataList.map((item) => (
            <PokemonEncyclopediaCard key={item.name} pokemon={item} />
          ))}
        </>
      )}
    </Box>
  );
}
