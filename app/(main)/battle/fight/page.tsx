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
  LinearProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";

import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { postRequestToServer } from "@/app/_firebase/clientFirestireApi";
import ResponsiveDialog from "@/app/_components/ResponsiveDialog";
import { useEffect, useState } from "react";
import { getRandomInRange } from "@/app/_utils/utils";
import {
  BattleRoomsProps,
  BattleRoomsUserProps,
} from "@/app/_interface/interface";
import { getPokemonByName } from "@/app/_pokemonApi/pokemonDataApi";
import { useRouter } from "next/navigation";

export default function FightPage() {
  const router = useRouter();
  const { loading, fetchedData } = usePokemonRedirect();
  const [opponentData, setOpponentData] = useState<null | BattleRoomsUserProps>(
    null
  );
  const [roomData, setRoomData] = useState<null | BattleRoomsProps>(null);
  const [opponentName, setOpponentName] = useState("");
  const [isDialog, setIsDialog] = useState(false);
  const [hpPercentage, setHpPercentage] = useState(100);
  const [opponentHpPercentage, setOpponentHpPercentage] = useState(100);
  const [isMoveDone, setIsMoveDone] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [timer, setTimer] = useState(999);

  const [attack, setAttack] = useState("head");
  const [block, setBlock] = useState("head");

  const handleReset = () => {
    setAttack("head");
    setBlock("head");
  };

  function triggerIsMoveDone(room: BattleRoomsProps) {
    if (fetchedData && fetchedData.battle.isBattleCreated) {
      if (room.battleMoves[room.battleMoves.length - 1].authorMove) {
        setIsMoveDone(true);
      } else {
        setIsMoveDone(false);
      }
    } else {
      if (room.battleMoves[room.battleMoves.length - 1].opponentMove) {
        setIsMoveDone(true);
      } else {
        setIsMoveDone(false);
      }
    }
  }

  const handleGetBattleRoom = async () => {
    if (fetchedData) {
      try {
        setMoveLoading(true);
        const response = await postRequestToServer(fetchedData.userId, {
          type: "get-battle-rooms",
        });

        const rooms = response.battleRooms as BattleRoomsProps[];

        if (fetchedData.battle.isBattleCreated) {
          const room = rooms.find(
            (room) => room.authorName === fetchedData.playerName
          );
          if (room) {
            triggerIsMoveDone(room);
            setRoomData(room);
            setOpponentData(room.opponentData);
            setOpponentName(room.opponentName);
          }
        } else {
          const room = rooms.find(
            (room) => room.opponentName === fetchedData.playerName
          );
          if (room) {
            triggerIsMoveDone(room);
            setRoomData(room);
            setOpponentData(room.authorData);
            setOpponentName(room.authorName);
          }
        }
        setMoveLoading(false);
      } catch (error) {
        setMoveLoading(false);
        console.error((error as Error).message);
      } finally {
        if (roomData && roomData?.timeFightEnds) {
          router.push("/battle/fight/end");
        }
      }
    }
  };

  async function handleMoveAction() {
    try {
      if (roomData?.timeFightEnds) {
        router.push("/battle/fight/end");
      }
      setMoveLoading(true);
      await postRequestToServer(fetchedData!.userId, {
        type: "battle-fight-move",
        attack,
        block,
      });

      const move = ["head", "body", "hands", "legs"];
      setAttack(move[getRandomInRange(0, 3)]);
      setBlock(move[getRandomInRange(0, 3)]);
    } catch (error) {
      setMoveLoading(false);
      console.error((error as Error).message);
    } finally {
      await handleGetBattleRoom();
    }
  }

  function calcRoundTimer() {
    let calc = Math.round(
      (roomData!.battleMoves[roomData!.battleMoves.length - 1].endTime -
        Date.now()) /
        1000
    );

    if (calc < 0) calc = 0;
    setTimer(calc);
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    function timerFunction() {
      timeout = setTimeout(async () => {
        calcRoundTimer();
        if (timer > 0) {
          timerFunction();
        } else {
          await handleMoveAction();
        }
      }, 1000);
    }
    timerFunction();
    return () => {
      clearTimeout(timeout);
    };
  }, [calcRoundTimer, timer]);

  useEffect(() => {
    (async () => {
      await handleGetBattleRoom();
    })();
  }, [fetchedData]);

  useEffect(() => {
    if (fetchedData && opponentData) {
      setHpPercentage((fetchedData.currentHP / fetchedData.stats.hp) * 100);
      setOpponentHpPercentage(
        (opponentData.currentHP / opponentData.stats.hp) * 100
      );
    }
  }, [fetchedData, opponentData]);

  if (loading || fetchedData === undefined || !opponentData) {
    return <StaticBackdrop />;
  }

  if (!fetchedData?.chosenPokemon || !fetchedData.battle.isInBattle)
    return (
      <Box>
        <Typography>Something went wrong.</Typography>
        <Typography>{`Can't get user data.`}</Typography>
      </Box>
    );

  return (
    <Box>
      {/* DIALOG */}
      <ResponsiveDialog
        isOpen={isDialog}
        setIsOpen={setIsDialog}
        title={"Leave Battle"}
        content={"Are you sure you want to leave this battle? "}
        handleSubmit={() => {}}
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
              <Box>
                {Boolean(roomData) && (
                  <>
                    <Typography>
                      Round: {roomData?.battleMoves.length}. Round ends in:{" "}
                      {timer}
                      s.
                    </Typography>
                  </>
                )}
              </Box>
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

              <Box
                sx={{ display: "flex", gap: "10px", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                >
                  <Button
                    disabled={isMoveDone || moveLoading}
                    variant="contained"
                    color="primary"
                    onClick={handleMoveAction}
                    sx={{ width: "100px" }}
                  >
                    Fight!
                  </Button>
                  <Button
                    disabled={moveLoading}
                    variant="contained"
                    color="primary"
                    onClick={handleGetBattleRoom}
                    sx={{ width: "100px" }}
                  >
                    Update
                  </Button>
                </Box>
                <Box
                  sx={{ display: "flex", gap: "10px", flexDirection: "row" }}
                >
                  <Button
                    disabled={moveLoading}
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                    sx={{ width: "100px" }}
                  >
                    Reset
                  </Button>

                  <Button
                    disabled={moveLoading}
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setIsDialog(true);
                    }}
                    sx={{ width: "100px" }}
                  >
                    Leave
                  </Button>
                </Box>
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
                  src={
                    getPokemonByName(opponentData.pokemonName)?.sprites
                      .front_default
                  } // Заменить на реальный путь к аватару оппонента
                  alt="Opponent"
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
                <Typography variant="h6">
                  {opponentName.toUpperCase()}
                </Typography>
                <List>
                  <ListItem>
                    HP: {`${opponentData.currentHP}/${opponentData.stats.hp}`}
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
                  <ListItem>Attack: {opponentData.stats.attack}</ListItem>
                  <ListItem>Defense: {opponentData.stats.defense}</ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Лог боя */}
        {roomData && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6">Лог поединка</Typography>
            <Paper sx={{ padding: 2, maxHeight: 200, overflowY: "auto" }}>
              {roomData.battleMoves.length > 1 ? (
                roomData.battleMoves
                  .map((battleMove, i) => {
                    return battleMove.prevAuthHitPart ? (
                      <Typography key={`log_${i}`}>
                        {roomData.authorName} hit {roomData.opponentName} to the{" "}
                        {battleMove.prevAuthHitPart} for the{" "}
                        {battleMove.prevAuthHitDmg}
                        {Boolean(battleMove.prevAuthHitDmg === 0) && " (block)"}
                        . {roomData.opponentName} hit {roomData.authorName} to
                        the {battleMove.prevOppHitPart} for the{" "}
                        {battleMove.prevOppHitDmg}
                        {Boolean(battleMove.prevOppHitDmg === 0) && " (block)"}.
                      </Typography>
                    ) : (
                      <Typography>Battle is started!</Typography>
                    );
                  })
                  .reverse()
              ) : (
                // <Typography>Делаем лог.</Typography>
                <Typography>Лог пуст...</Typography>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
