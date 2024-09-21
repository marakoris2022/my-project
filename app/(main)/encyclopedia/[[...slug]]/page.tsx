"use client";

import { useState, useEffect } from "react";
import { getPokemonListByExp } from "@/app/_pokemonApi/pokemonDataApi";
import { Box, Typography, Pagination } from "@mui/material";

// Типы данных о покемоне
import { PokemonProps } from "@/app/_pokemonApi/pokemonDataApi";
import { usePathname } from "next/navigation";
import PokemonEncyclopediaCard from "@/app/_components/PokemonEncyclopediaCard";

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
        <PokemonEncyclopediaCard key={pokemon.name} pokemon={pokemon} />
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
