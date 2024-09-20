"use client";

import { useState, useEffect } from "react";
import { getPokemonListByExp } from "@/app/_pokemonApi/pokemonDataApi";
import { Box, Card, Typography, Grid, Avatar, Pagination } from "@mui/material";

// Типы данных о покемоне
import { PokemonProps } from "@/app/_pokemonApi/pokemonDataApi";
import { usePathname } from "next/navigation";

export default function Encyclopedia({ params }: { params: { slug: string } }) {
  const startPage = Number(params.slug) || 1;
  const [pokemonList, setPokemonList] = useState<PokemonProps[]>([]);
  const [page, setPage] = useState(startPage);
  const [itemsPerPage] = useState(20);
  const pathname = usePathname().split("/");

  // Получение списка покемонов
  useEffect(() => {
    const fetchPokemon = async () => {
      const data = await getPokemonListByExp("inc");
      setPokemonList(data);
    };
    fetchPokemon();
  }, []);

  // Если данные загружаются
  if (!pokemonList || pokemonList.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  // Подсчитываем количество страниц
  const totalPages = Math.ceil(pokemonList.length / itemsPerPage);

  // Логика для отображения покемонов на текущей странице
  const currentPokemonList = pokemonList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Обработчик изменения страницы
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    const pathArray = [...pathname];
    pathArray[2] = String(value);
    history.replaceState(null, "", pathArray.join("/"));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center" }} gutterBottom>
        Pokémon Encyclopedia
      </Typography>

      {/* Грид для покемонов */}
      {currentPokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} />
      ))}

      {/* Пагинация */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
}

// Компонент для отображения карточки покемона
function PokemonCard({ pokemon }: { pokemon: PokemonProps }) {
  return (
    <Card sx={{ width: "100%", m: "0", paddingRight: "20px", mb: "15px" }}>
      <Grid
        sx={{ m: "0", p: "0" }}
        container
        direction="row"
        alignItems="center"
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
        <Grid item xs>
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

        {/* Статистика */}
        <Grid item>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <Typography variant="body2">
              <strong>Stats:</strong>
            </Typography>
            <Typography variant="body2">HP: {pokemon.stats.hp}</Typography>
            <Typography variant="body2">
              Attack: {pokemon.stats.attack}
            </Typography>
            <Typography variant="body2">
              Defense: {pokemon.stats.defense}
            </Typography>
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
        </Grid>
      </Grid>
    </Card>
  );
}
