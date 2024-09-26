"use client";

import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  Paper,
  LinearProgress,
  CardMedia,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { postRequestToServer } from "@/app/_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";
import ResponsiveDialog from "@/app/_components/ResponsiveDialog";
import { useEffect, useState } from "react";
import { getPokemonByName } from "@/app/_pokemonApi/pokemonDataApi";
import { generateFightLog, getRandomInRange } from "@/app/_utils/utils";
import { FightDataProps, FightResponseProps } from "@/app/_interface/interface";

export default function FightPage() {
  const { loading, fetchedData, setFetchedData } = usePokemonRedirect();
  const [isDialog, setIsDialog] = useState(false);
  const [isFight, setIsFight] = useState(true);
  const [fightData, setFightData] = useState<null | FightDataProps>(null);
  const [hpPercentage, setHpPercentage] = useState(100);
  const [opponentHpPercentage, setOpponentHpPercentage] = useState(100);
  const router = useRouter();

  const [attack, setAttack] = useState("head");
  const [block, setBlock] = useState("head");
  const [log, setLog] = useState<string[]>([]);

  const handleReset = () => {
    setAttack("head");
    setBlock("head");
  };

  useEffect(() => {
    if (fetchedData && fetchedData.fight.opponent) {
      setHpPercentage((fetchedData.currentHP / fetchedData.stats.hp) * 100);
      setOpponentHpPercentage(
        (fetchedData.fight.opponent.currentHP /
          fetchedData.fight.opponent.stats.hp) *
          100
      );
    }
  }, [fetchedData]);

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  if (!fetchedData?.chosenPokemon || !fetchedData.fight.isFight)
    return (
      <Box>
        <Typography>Something went wrong.</Typography>
        <Typography>{`Can't get user data.`}</Typography>
      </Box>
    );

  async function handleLeaveFight() {
    try {
      await postRequestToServer(fetchedData!.userId, {
        type: "training-leave-fight",
      });

      router.push("/training");
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  async function handleMoveAction() {
    try {
      const response = (await postRequestToServer(fetchedData!.userId, {
        type: "training-fight-move",
        attack,
        block,
      })) as FightResponseProps;

      if (response.fightData.fightEnd) {
        setIsFight(false);
        setFightData(response.fightData);
      } else {
        setLog((prevLog) => [generateFightLog(response.fightData), ...prevLog]);
        setFetchedData(response.userData);
      }

      const move = ["head", "body", "hands", "legs"];
      setAttack(move[getRandomInRange(0, 3)]);
      setBlock(move[getRandomInRange(0, 3)]);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  if (!isFight && fightData) {
    const pokemon = getPokemonByName(fightData.opponentName);

    return (
      <>
        <Typography sx={{ textAlign: "center", padding: "20px" }} variant="h3">
          Battle is over.{" "}
          {fightData.newCurrentHPUser > 0 ? " Victory!" : "Lose..."}
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "500px",
            background: "azure",
            borderRadius: "15px",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "55%",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: "20px",
            }}
          >
            <Typography variant="h5" sx={{ mb: "10px" }}>
              Your experience for this battle is : {fightData.expGet}.
            </Typography>
            {fightData.pokemonGet ? (
              <>
                <Typography sx={{ mb: "10px" }}>
                  You got a new Pokemon!
                </Typography>
                {pokemon && (
                  <Box
                    sx={{
                      border: "2px solid gold",
                      borderRadius: "15px",
                      background: "white",
                      p: "20px",
                      width: "270px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4">{pokemon.name}</Typography>
                    <CardMedia
                      component="img"
                      image={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      sx={{
                        width: "40%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Typography variant="body1">
                      Hit Points: {pokemon.stats.hp}
                    </Typography>
                    <Typography variant="body1">
                      Attack : {pokemon.stats.attack}
                    </Typography>
                    <Typography variant="body1">
                      Defense: {pokemon.stats.defense}
                    </Typography>
                    <Typography variant="body1">
                      Special Attack: {pokemon.stats["special-attack"]}
                    </Typography>
                    <Typography variant="body1">
                      Special Defense: {pokemon.stats["special-defense"]}
                    </Typography>
                    <Typography variant="body1">
                      Speed: {pokemon.stats.speed}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Typography>
                  You dont catch {fightData.opponentName.toUpperCase()}!
                </Typography>
              </>
            )}
            <Button
              variant="outlined"
              color="warning"
              sx={{ m: "20px", color: "black" }}
              onClick={() => {
                router.push("/profile");
              }}
            >
              Exit Battle
            </Button>
          </Box>
          <Box
            sx={{
              backgroundImage:
                fightData.newCurrentHPUser > 0
                  ? `url(/training-ground-fight-win-${getRandomInRange(
                      1,
                      3
                    )}.webp)`
                  : `url(/training-ground-fight-lost-${getRandomInRange(
                      1,
                      3
                    )}.webp)`,
              width: "45%",
              height: "500px",
              backgroundSize: "cover", // Заставляем изображение заполнять всё пространство
              backgroundPosition: "center", // Центрируем изображение
              backgroundRepeat: "no-repeat", // Избегаем повторения изображения
            }}
          ></Box>
        </Box>
      </>
    );
  }

  return (
    <Box>
      {/* DIALOG */}
      <ResponsiveDialog
        isOpen={isDialog}
        setIsOpen={setIsDialog}
        title={"Leave Battle"}
        content={"Are you sure you want to leave this battle? "}
        handleSubmit={handleLeaveFight}
      />

      <Box sx={{ padding: 4 }}>
        <Grid container spacing={2}>
          {/* Карточка пользователя */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: "15px" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={fetchedData.sprites.front_default} // Заменить на реальный путь к аватару пользователя
                  alt="User"
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
                <Typography variant="h6">{fetchedData.playerName}</Typography>
                <List>
                  <ListItem>
                    HP: {`${fetchedData.currentHP}/${fetchedData.stats.hp}`}
                  </ListItem>
                  <ListItem>
                    <LinearProgress
                      variant="determinate"
                      value={hpPercentage}
                      color={hpPercentage > 30 ? "success" : "error"}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        marginTop: 1,
                        width: "100%",
                      }}
                    />
                  </ListItem>
                  <ListItem>Attack: {fetchedData.stats.attack}</ListItem>
                  <ListItem>Defense: {fetchedData.stats.defense}</ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Форма выбора атаки и блока */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: 2,
              }}
            >
              {/* const [attack, setAttack] = useState("head"); // состояние для
              Attack const [block, setBlock] = useState("head"); // состояние
              для Block return ( */}
              <Box sx={{ display: "flex", flexDirection: "row", gap: "15px" }}>
                {/* Форма атаки */}
                <FormControl sx={{ textAlign: "start" }}>
                  <FormLabel id="attack-form">Attack</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="attack-form"
                    name="attack"
                    value={attack} // контроль через значение состояния
                    sx={{ display: "flex", flexDirection: "column" }}
                    onChange={(e) => {
                      setAttack(e.target.value); // обновление состояния
                    }}
                  >
                    <FormControlLabel
                      value="head"
                      control={<Radio />}
                      label="Head"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="body"
                      control={<Radio />}
                      label="Body"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="hands"
                      control={<Radio />}
                      label="Hands"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="legs"
                      control={<Radio />}
                      label="Legs"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </FormControl>

                <Box
                  sx={{ height: "inherit", width: "3px", background: "gray" }}
                />

                {/* Форма блока */}
                <FormControl sx={{ textAlign: "end" }}>
                  <FormLabel id="block-form">Block</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="block-form"
                    name="block"
                    value={block} // контроль через значение состояния
                    sx={{ display: "flex", flexDirection: "column" }}
                    onChange={(e) => {
                      setBlock(e.target.value); // обновление состояния
                    }}
                  >
                    <FormControlLabel
                      value="head"
                      control={<Radio />}
                      label="Head"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="body"
                      control={<Radio />}
                      label="Body"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="hands"
                      control={<Radio />}
                      label="Hands"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="legs"
                      control={<Radio />}
                      label="Legs"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", gap: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMoveAction}
                >
                  Fight!
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setIsDialog(true);
                  }}
                >
                  Leave
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Карточка оппонента */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: "15px" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={fetchedData.fight.opponent.sprites.front_default} // Заменить на реальный путь к аватару оппонента
                  alt="Opponent"
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
                <Typography variant="h6">
                  {fetchedData.fight.opponent.name.toUpperCase()}
                </Typography>
                <List>
                  <ListItem>
                    HP:{" "}
                    {`${fetchedData.fight.opponent.currentHP}/${fetchedData.fight.opponent.stats.hp}`}
                  </ListItem>
                  <ListItem>
                    <LinearProgress
                      variant="determinate"
                      value={opponentHpPercentage}
                      color={opponentHpPercentage > 30 ? "success" : "error"}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        marginTop: 1,
                        width: "100%",
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    Attack: {fetchedData.fight.opponent.stats.attack}
                  </ListItem>
                  <ListItem>
                    Defense: {fetchedData.fight.opponent.stats.defense}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Лог боя */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Лог поединка</Typography>
          <Paper sx={{ padding: 2, maxHeight: 200, overflowY: "auto" }}>
            {log.length === 0 ? (
              <Typography>Лог пуст...</Typography>
            ) : (
              log.map((entry, index) => (
                <Typography key={index}>{entry}</Typography>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
