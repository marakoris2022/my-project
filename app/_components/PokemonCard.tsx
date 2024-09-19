import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "../_customHooks/useAuth";
import { User } from "firebase/auth";
import { saveUserData } from "../_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PokemonProps } from "../_pokemonApi/pokemonDataApi";

async function addChosenPokemonToUserData(
  user: User,
  pokemonData: PokemonProps,
  router: AppRouterInstance
) {
  try {
    await saveUserData(user.uid, {
      level: 0,
      currentExp: 0,
      playerName: user.displayName,
      chosenPokemon: pokemonData.name,
      currentHP: pokemonData.stats.hp,
      maxHP: pokemonData.stats.hp,
      ...pokemonData,
    });
  } catch (error) {
    console.error((error as Error).message);
  } finally {
    router.refresh();
  }
}

function PokemonCard({ pokemonData }: { pokemonData: PokemonProps }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: 600,
        boxShadow: 4,
        borderRadius: 4,
        backgroundColor: "#f1f8ff", // Светлый фантастический фон
        overflow: "hidden",
        margin: "auto",
      }}
    >
      {/* Картинка покемона */}
      <CardMedia
        component="img"
        image={pokemonData.sprites.front_default}
        alt={pokemonData.name}
        sx={{
          width: "40%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
          backgroundColor: "#e0f7fa", // Мягкий цвет для контента
          width: "60%",
        }}
      >
        {/* Название покемона */}
        <Typography
          variant="h4"
          component="div"
          sx={{ color: "black", fontWeight: 600, textAlign: "center" }}
        >
          {pokemonData.name.toUpperCase()}
        </Typography>

        {/* Основная информация о покемоне */}
        <Box>
          <Typography variant="body1" sx={{ color: "#546e7a" }}>
            Height: {pokemonData.height} dm
          </Typography>
          <Typography variant="body1" sx={{ color: "#546e7a" }}>
            Weight: {pokemonData.weight} hg
          </Typography>
          <Typography variant="body1" sx={{ color: "#546e7a" }}>
            Types: {pokemonData.types}
          </Typography>
        </Box>

        {/* Статистика покемона */}
        <Box
          component="div"
          sx={{
            backgroundColor: "#f1f8ff",
            borderRadius: 2,
            padding: 1,
            marginTop: 1,
            border: "1px solid gray",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#37474f",
              fontWeight: 600,
              textAlign: "center",
              mb: "3px",
            }}
          >
            Stats
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                HP: {pokemonData.stats.hp}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Attack: {pokemonData.stats.attack}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Defense: {pokemonData.stats.defense}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Speed: {pokemonData.stats.speed}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Special Attack: {pokemonData.stats["special-attack"]}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Special Defense: {pokemonData.stats["special-defense"]}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Кнопка */}
        <Button
          endIcon={<FavoriteBorderIcon />}
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            borderRadius: 4,
            textTransform: "none",
            fontWeight: "bold",
            ":hover": { backgroundColor: "#1995d2" },
            marginTop: 1,
          }}
          onClick={async () => {
            await addChosenPokemonToUserData(user!, pokemonData, router);
            router.refresh();
          }}
        >
          Choose!
        </Button>
      </CardContent>
    </Card>
  );
}

export default PokemonCard;
