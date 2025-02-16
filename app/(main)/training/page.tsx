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
import { postRequestToServer } from "@/app/_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import {
  getPokemonListByExpRange,
  PokemonProps,
} from "@/app/_pokemonApi/pokemonDataApi";
import { useEffect, useState } from "react";
import { POKEMON_TRAINING_GROUND_RANGE } from "@/app/_constants/constants";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const [error, setError] = useState("");
  const [pokemonDataList, setPokemonDataList] = useState<PokemonProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (fetchedData) {
      setPokemonDataList(
        getPokemonListByExpRange(
          fetchedData!.currentExp - POKEMON_TRAINING_GROUND_RANGE.MINUS,
          fetchedData!.currentExp + POKEMON_TRAINING_GROUND_RANGE.PLUS
        )
      );
    }
  }, [fetchedData]);

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  async function handleTraining() {
    if (fetchedData && fetchedData.currentHP < fetchedData.stats.hp) {
      setError("You must restore your health to enter a training ground.");
      return;
    }

    try {
      await postRequestToServer(fetchedData!.userId, {
        type: "start-training",
      });

      router.push("/training/ground");
    } catch (error) {
      console.error("error", error);
    }
  }

  if (!fetchedData?.chosenPokemon)
    return (
      <Box>
        <Typography>Something went wrong.</Typography>
        <Typography>{`Can't get user data.`}</Typography>
      </Box>
    );

  const { stats, currentExp, level, currentHP } = fetchedData;

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
              Health: {currentHP}/{stats.hp}
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
        {Boolean(error) && (
          <Typography sx={{ fontSize: "14px", color: "red" }} gutterBottom>
            {error}
          </Typography>
        )}
        <Typography variant="h6" gutterBottom>
          You can find these enemies based on your current experience.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Each time when you slay a Pokémon, you have chance to catch it!
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
}
