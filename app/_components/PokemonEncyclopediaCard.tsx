import { PokemonProps } from "../_pokemonApi/pokemonDataApi";
import { Box, Card, Typography, Grid, Avatar } from "@mui/material";

// Компонент для отображения карточки покемона
export default function PokemonEncyclopediaCard({
  pokemon,
}: {
  pokemon: PokemonProps;
}) {
  return (
    <Card
      sx={{
        width: "fit-content",
        minWidth: "900px",
        m: "0 auto",
        paddingRight: "20px",
        mb: "15px",
      }}
    >
      <Grid
        sx={{ m: "0", p: "0" }}
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Аватар покемона */}
          <Grid item>
            <Avatar
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>

          {/* Основная информация */}
          <Grid item>
            <Typography variant="h6" component="div">
              {pokemon.name.toUpperCase()} (Order: {pokemon.order})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Type: {pokemon.types}, Height: {pokemon.height}m, Weight:{" "}
              {pokemon.weight}kg
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Base Experience: {pokemon.base_experience}
            </Typography>
          </Grid>
        </Box>

        {/* Статистика */}
        <Grid item>
          <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Typography variant="body2">
              <strong>Stats:</strong>
            </Typography>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "space-between",
                  mb: "5px",
                }}
              >
                <Typography variant="body2">HP: {pokemon.stats.hp}</Typography>
                <Typography variant="body2">
                  Attack: {pokemon.stats.attack}
                </Typography>
                <Typography variant="body2">
                  Defense: {pokemon.stats.defense}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  Special Attack: {pokemon.stats["special-attack"]}
                </Typography>
                <Typography variant="body2">
                  Special Defense: {pokemon.stats["special-defense"]}
                </Typography>
                <Typography variant="body2">
                  Speed: {pokemon.stats.speed}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
