"use client";

import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { saveUserData } from "@/app/_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import {
  getPokemonListByExpRange,
  PokemonProps,
} from "@/app/_pokemonApi/pokemonDataApi";
import { getRandomInRange } from "@/app/_utils/utils";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const [pokemonDataList, setPokemonDataList] = useState<PokemonProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (fetchedData) {
      setPokemonDataList(
        getPokemonListByExpRange(
          fetchedData!.currentExp - 10,
          fetchedData!.currentExp + 40
        )
      );
    }
  }, [fetchedData]);

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  async function handleTraining() {
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

  const { stats, currentExp, maxHP, level, training } = fetchedData;
  const timeRemaining = Math.max(0, training.trainingEnd - Date.now());
  const minutesRemaining = Math.floor(timeRemaining / 60000);
  const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

  if (fetchedData && !fetchedData["training"].isTraining)
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Ready for Training?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Prepare your Pokémon for an intense training session.
        </Typography>
        <Card sx={{ margin: "20px auto", maxWidth: "400px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Pokémon Stats
            </Typography>
            <Typography>Level: {level}</Typography>
            <Typography>Experience: {currentExp}</Typography>
            <Typography>
              Health: {stats.hp}/{maxHP}
            </Typography>
            <Typography>Speed: {stats.speed}</Typography>
          </CardContent>
        </Card>
        <Button
          sx={{ mb: 1 }}
          variant="contained"
          color="primary"
          onClick={handleTraining}
        >
          Start Training
        </Button>
        <Typography variant="h6" gutterBottom>
          You can find these enemies based on your current experience.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {pokemonDataList.map((item) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={item.name}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <CardMedia
                      component="img"
                      image={item.sprites.front_default}
                      alt={item.name}
                      sx={{ width: "100px", height: "100px", margin: "0 auto" }}
                    />

                    <Typography>
                      Base Experience: {item.base_experience}
                    </Typography>
                    <Typography>Height: {item.height} decimetres</Typography>
                    <Typography>Weight: {item.weight} hectograms</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Training Ground
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your training session is in progress.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Time remaining: {minutesRemaining}m {secondsRemaining}s
      </Typography>
      <Typography variant="h6" gutterBottom>
        Current Pokémon Stats
      </Typography>
      <Card sx={{ margin: "20px auto", maxWidth: "400px" }}>
        <CardContent>
          <Typography>Level: {level}</Typography>
          <Typography>Experience: {currentExp}</Typography>
          <Typography>
            Health: {stats.hp}/{maxHP}
          </Typography>
          <Typography>Speed: {stats.speed}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
