import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  LinearProgress,
} from "@mui/material";
import { PokemonProfileProps } from "../_pokemonApi/pokemonDataApi";
import {
  deleteUserFromDB,
  saveUserData,
} from "../_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ResponsiveDialog from "./ResponsiveDialog";

function PokemonProfilePage({ pokemon }: { pokemon: PokemonProfileProps }) {
  const [isDialog, setIsDialog] = useState(false);
  const hpPercentage = (pokemon.currentHP / pokemon.maxHP) * 100;
  const router = useRouter();

  async function handleDelete() {
    await deleteUserFromDB(pokemon.userId);
    await saveUserData(pokemon.userId, {
      training: {
        isTraining: false,
      },
    });
    router.push("/profile/create");
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      {/* DIALOG */}
      <ResponsiveDialog
        isOpen={isDialog}
        setIsOpen={setIsDialog}
        title={"Remove Current Pokémon"}
        content={
          "Are you sure you want to remove the current Pokémon? You will lose all progress after confirming."
        }
        handleSubmit={handleDelete}
      />

      {/* Карточка персонажа */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 800,
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
        }}
      >
        <CardContent>
          {/* Заголовок и аватар */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <Avatar
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              sx={{
                width: 120,
                height: 120,
                border: "1px solid #3f51b5",
                background: "azure",
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#3f51b5">
                {`${pokemon.name.toUpperCase()} | ${pokemon.playerName.toUpperCase()}`}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {`Level: ${pokemon.level} | Type: ${pokemon.types}`}
              </Typography>
            </Box>
            <Button
              color="error"
              variant="outlined"
              onClick={async () => {
                setIsDialog(true);
              }}
            >
              <DeleteForeverIcon />
            </Button>
          </Box>

          {/* HP Bar */}
          <Box sx={{ marginTop: 3, marginBottom: 3, width: "300px" }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ textAlign: "center" }}
            >
              <strong>Current HP: </strong> {pokemon.currentHP}/{pokemon.maxHP}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={hpPercentage}
              //   color={hpPercentage > 50 ? "primary" : "secondary"}
              color={"error"}
              sx={{
                height: 10,
                borderRadius: 5,
                marginTop: 1,
              }}
            />
          </Box>

          {/* Основная информация */}
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Height:</strong> {pokemon.height} dm
              </Typography>
              <Typography variant="body1">
                <strong>Weight:</strong> {pokemon.weight} hg
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Current Exp:</strong> {pokemon.currentExp}
              </Typography>
              <LinearProgress
                variant="determinate"
                // value={(pokemon.currentExp / pokemon.currentExp) * 100}
                value={100}
                sx={{ marginTop: 1, marginBottom: 1 }}
              />
            </Grid>
          </Grid>

          {/* Статистика покемона */}
          <Box
            sx={{
              backgroundColor: "#e0f7fa",
              padding: 2,
              borderRadius: 2,
              width: "70%",
              margin: "30px auto",
            }}
          >
            <Typography
              variant="h6"
              color="#00796b"
              sx={{ textAlign: "center", mb: "15px", fontWeight: "bold" }}
            >
              Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">HP: {pokemon.maxHP}</Typography>
                <Typography variant="body2">
                  Attack: {pokemon.stats.attack}
                </Typography>
                <Typography variant="body2">
                  Defense: {pokemon.stats.defense}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Speed: {pokemon.stats.speed}
                </Typography>
                <Typography variant="body2">
                  Special Attack: {pokemon.stats["special-attack"]}
                </Typography>
                <Typography variant="body2">
                  Special Defense: {pokemon.stats["special-defense"]}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Кнопки действий */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 4 }}
              onClick={() => {
                router.push("/training");
              }}
            >
              Train
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 4 }}
            >
              Battle
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PokemonProfilePage;
