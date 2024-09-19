"use client";

import { Box, Button, CardMedia, Typography } from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { useState, useEffect } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const defaultSettings = {
  lastButton: "down",
  windowWidth: 800,
  windowHeight: 500,
  heroTop: 10,
  heroLeft: 10,
  step: 10, // Шаг перемещения
};

export function PokemonMapCard({
  lastButton,
  imageFront,
  imageBack,
  name,
  top,
  left,
}: {
  lastButton: string;
  imageFront: string;
  imageBack: string;
  name: string;
  top: number;
  left: number;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        borderRadius: "7px",
        padding: "5px",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          maxWidth: "80px",
          fontSize: "14px",
        }}
      >
        {name.toUpperCase()}
      </Typography>
      <CardMedia
        component="img"
        image={
          lastButton === "down" || lastButton === "left"
            ? imageFront
            : imageBack
        }
        alt={name}
        sx={{
          width: "80px",
          height: "80px",
        }}
      />
    </Box>
  );
}

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const [settings, setSettings] = useState(defaultSettings);

  // Функция для движения влево
  const handleMoveLeft = () => {
    setSettings((prev) => ({
      ...prev,
      lastButton: "left",
      heroLeft: Math.max(0, prev.heroLeft - prev.step),
    }));
  };

  // Функция для движения вправо
  const handleMoveRight = () => {
    setSettings((prev) => ({
      ...prev,
      lastButton: "right",
      heroLeft: Math.min(prev.windowWidth - 80, prev.heroLeft + prev.step),
    }));
  };

  // Функция для движения вверх
  const handleMoveUp = () => {
    setSettings((prev) => ({
      ...prev,
      lastButton: "up",
      heroTop: Math.max(0, prev.heroTop - prev.step),
    }));
  };

  // Функция для движения вниз
  const handleMoveDown = () => {
    setSettings((prev) => ({
      ...prev,
      lastButton: "down",
      heroTop: Math.min(prev.windowHeight - 80, prev.heroTop + prev.step),
    }));
  };

  // Обработка клавиатуры
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        handleMoveLeft();
        break;
      case "ArrowRight":
        handleMoveRight();
        break;
      case "ArrowUp":
        handleMoveUp();
        break;
      case "ArrowDown":
        handleMoveDown();
        break;
      default:
        break;
    }
  };

  // Добавляем и удаляем обработчики событий для клавиатуры
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (fetchedData) {
      setSettings((prev) => {
        return {
          ...prev,
          step: Math.floor(fetchedData.stats.speed / 10),
        };
      });
    }
  }, [fetchedData]);

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

  return (
    <Box>
      <Typography
        sx={{
          textAlign: "center",
          marginBottom: "15px",
          paddingTop: "10px",
          fontSize: "30px",
        }}
      >
        Training Ground
      </Typography>
      <Box
        sx={{
          margin: "0 auto",
          width: `${settings.windowWidth}px`,
          height: `${settings.windowHeight}px`,
          background: "azure",
          border: "2px solid black",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <PokemonMapCard
          lastButton={settings.lastButton}
          imageFront={fetchedData.sprites.front_default}
          imageBack={fetchedData.sprites.back_default}
          name={fetchedData.chosenPokemon}
          top={settings.heroTop}
          left={settings.heroLeft}
        />
      </Box>

      {/* Кнопки для перемещения */}
      <Box sx={{ margin: "0 auto", width: "fit-content", padding: "10px" }}>
        <Button
          variant="contained"
          onClick={handleMoveLeft}
          sx={{ marginRight: "10px" }}
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="contained"
          onClick={handleMoveUp}
          sx={{ marginRight: "10px" }}
        >
          <ArrowDropUpIcon />
        </Button>
        <Button
          variant="contained"
          onClick={handleMoveDown}
          sx={{ marginRight: "10px" }}
        >
          <ArrowDropDownIcon />
        </Button>

        <Button
          sx={{ marginRight: "10px" }}
          variant="contained"
          onClick={handleMoveRight}
        >
          <ArrowRightIcon />
        </Button>
        <Typography sx={{ display: "inline-block" }}>
          Move speed: {fetchedData.stats.speed}
        </Typography>
      </Box>
    </Box>
  );
}
