"use client";

import { Box, Button, Typography } from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { useState, useEffect } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { saveUserData } from "@/app/_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import PokemonMapCard from "@/app/_components/PokemonMapCard";
import { trainingGroundDefaultSettings } from "@/app/_constants/constants";
import { calculateDistance } from "@/app/_utils/utils";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const [settings, setSettings] = useState(trainingGroundDefaultSettings);
  const router = useRouter();

  async function handleLeaveTraining() {
    await saveUserData(fetchedData!.userId, {
      ...fetchedData,
      training: {
        isTraining: false,
      },
    });
    router.push("/training");
  }

  useEffect(() => {
    function logDistances(settings: typeof trainingGroundDefaultSettings) {
      const { heroTop, heroLeft, opponent } = settings;
      (Object.keys(opponent) as Array<"a" | "b" | "c" | "d" | "e">).forEach(
        (key) => {
          const distance = calculateDistance(
            heroLeft,
            heroTop,
            opponent[key].left,
            opponent[key].top
          );

          if (distance < 20) {
            console.log(`Fight! ${fetchedData?.training.opponents[key]}`);
          }
        }
      );
    }

    logDistances(settings);
  }, [
    settings.heroTop,
    settings.heroLeft,
    settings,
    fetchedData?.training.opponents,
  ]);

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

          backgroundImage: settings.background, // Добавляем фоновое изображение
          backgroundSize: "cover", // Заставляем изображение заполнять всё пространство
          backgroundPosition: "center", // Центрируем изображение
          backgroundRepeat: "no-repeat", // Избегаем повторения изображения
          border: "2px solid black",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        {(
          Object.keys(fetchedData.training.opponents) as Array<
            "a" | "b" | "c" | "d" | "e"
          >
        ).map((key, index) => {
          return (
            <PokemonMapCard
              key={index}
              lastButton={"down"}
              imageFront={
                fetchedData.training.opponents[key].sprites.front_default
              }
              imageBack={"empty"}
              name={fetchedData.training.opponents[key].name}
              top={settings.opponent[key].top}
              left={settings.opponent[key].left}
            />
          );
        })}
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

        <Button
          variant="contained"
          onClick={handleLeaveTraining}
          endIcon={<ExitToAppIcon />}
          color="warning"
        >
          Leave Training
        </Button>
      </Box>
    </Box>
  );
}
