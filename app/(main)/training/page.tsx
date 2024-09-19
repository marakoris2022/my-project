"use client";

import { Box, Button, Typography } from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { saveUserData } from "@/app/_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import { getPokemonListByExp } from "@/app/_pokemonApi/pokemonDataApi";
import { getRandomInRange } from "@/app/_utils/utils";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const router = useRouter();

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  async function handleTraining() {
    const pokemonDataList = getPokemonListByExp("inc").slice(0, 15);

    await saveUserData(fetchedData!.userId, {
      training: {
        isTraining: true,
        trainingStarted: Date.now(),
        trainingEnd: Date.now() + 1000 * 60 * 5,
        opponents: {
          a: pokemonDataList[getRandomInRange(0, pokemonDataList.length - 1)],
          b: pokemonDataList[getRandomInRange(0, pokemonDataList.length - 1)],
          c: pokemonDataList[getRandomInRange(0, pokemonDataList.length - 1)],
          d: pokemonDataList[getRandomInRange(0, pokemonDataList.length - 1)],
          e: pokemonDataList[getRandomInRange(0, pokemonDataList.length - 1)],
        },
      },
    });
    router.push("/training/ground");
  }

  if (!fetchedData)
    return (
      <Box>
        <Typography>Something went wrong.</Typography>
        <Typography>{`Can't get user data.`}</Typography>
      </Box>
    );

  if (fetchedData && !fetchedData["training"].isTraining)
    return (
      <Box>
        <Typography>Start training?</Typography>
        <Button onClick={handleTraining}>Start</Button>
      </Box>
    );

  return <Box>Training Ground</Box>;
}
