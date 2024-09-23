"use client";

import { Avatar, Box, Button, List, ListItem, Typography } from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import {
  fetchUserData,
  postRequestToServer,
} from "@/app/_firebase/clientFirestireApi";
import { useCallback, useEffect, useState } from "react";
import { getFormattedTime } from "@/app/_utils/utils";
import { getPokemonByName } from "@/app/_pokemonApi/pokemonDataApi";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
import AddIcon from "@mui/icons-material/Add";

type BattleRoomsUserProps = {
  level: number;
  pokemonName: string;
  stats: {
    attack: number;
    defense: number;
    hp: number;
    "special-attack": number;
    "special-defense": number;
    speed: number;
  };
};

type BattleRoomsProps = {
  authorData: BattleRoomsUserProps;
  authorName: string;
  opponentData: BattleRoomsUserProps;
  opponentName: string;
  time: number;
};

export default function BattlePage() {
  const { loading, fetchedData, setFetchedData } = usePokemonRedirect();
  const [battleRooms, setBattleRooms] = useState<null | BattleRoomsProps[]>(
    null
  );
  const [updateTime, setUpdateTimer] = useState(15);

  const handleGetBattleRooms = useCallback(async () => {
    if (fetchedData) {
      try {
        const response = await postRequestToServer(fetchedData.userId, {
          type: "get-battle-rooms",
        });

        setBattleRooms(response.battleRooms);
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }, [fetchedData]);

  async function handleCloseRequest() {
    if (fetchedData) {
      try {
        const response = await postRequestToServer(fetchedData.userId, {
          type: "close-battle-room",
        });

        setBattleRooms(response.battleRooms); // обновляем battleRooms
        setFetchedData(await fetchUserData(fetchedData.userId));
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  async function handleCreateBattle() {
    if (fetchedData) {
      try {
        const response = await postRequestToServer(fetchedData.userId, {
          type: "create-battle",
        });

        setBattleRooms(response.battleRooms); // обновляем battleRooms
        setFetchedData(await fetchUserData(fetchedData.userId));
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  function handleJoinBattleRoom() {}

  useEffect(() => {
    (async () => await handleGetBattleRooms())();
  }, [handleGetBattleRooms]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    function runTimer() {
      if (updateTime > 0) {
        timerId = setTimeout(() => {
          setUpdateTimer((time) => time - 1);
          runTimer();
        }, 1000);
      } else {
        handleGetBattleRooms();
        setUpdateTimer(15);
      }
    }

    runTimer();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [handleGetBattleRooms, updateTime]);

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  if (!fetchedData)
    return (
      <Box>
        <Typography>Something wrong.</Typography>
        <Typography>Cant get user Data.</Typography>
      </Box>
    );

  return (
    <Box sx={{ pt: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid black",
          borderRadius: "10px",
          padding: "0px 15px",
          mb: "30px",
          gap: "20px",
        }}
      >
        <Typography>Battle</Typography>
        {!fetchedData.battle.isBattleCreated && (
          <Button
            color="success"
            endIcon={<AddIcon />}
            onClick={handleCreateBattle}
          >
            Create Battle
          </Button>
        )}
        {fetchedData.battle.isBattleCreated && (
          <Button
            endIcon={<CloseIcon />}
            color="error"
            onClick={handleCloseRequest}
          >
            Close request
          </Button>
        )}
        <Button endIcon={<SyncIcon />} onClick={handleGetBattleRooms}>
          Get Battle Rooms {updateTime}s.
        </Button>
      </Box>
      {battleRooms &&
        battleRooms.map((room, i) => {
          return (
            <Box
              key={`room_box_${i}`}
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "0px 15px",
                mb: "10px",
              }}
            >
              <Box
                sx={{
                  width: "250px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography>
                  {getFormattedTime(room.time)} | {room.authorName} |{" "}
                  {room.authorData.pokemonName}
                </Typography>
                <Avatar
                  src={
                    getPokemonByName(room.authorData.pokemonName)?.sprites
                      .front_default
                  }
                  alt={"PokemonImg"}
                  sx={{
                    width: "60px",
                    height: "60px",
                    p: "0px",
                    m: "-6px",
                  }}
                />
              </Box>
              <List sx={{ display: "flex", flexDirection: "row" }}>
                <ListItem sx={{ width: "110px" }}>
                  Hits: {room.authorData.stats.hp}
                </ListItem>
                <ListItem sx={{ width: "110px" }}>
                  ATK: {room.authorData.stats.attack}
                </ListItem>
                <ListItem sx={{ width: "110px" }}>
                  DEF: {room.authorData.stats.defense}
                </ListItem>
                <ListItem sx={{ width: "110px" }}>
                  S-ATK: {room.authorData.stats["special-attack"]}
                </ListItem>
                <ListItem sx={{ width: "110px" }}>
                  S-DEF: {room.authorData.stats["special-defense"]}
                </ListItem>
                <ListItem sx={{ width: "110px" }}>
                  SPD: {room.authorData.stats.speed}
                </ListItem>
              </List>
              {Boolean(room.authorName !== fetchedData.playerName) && (
                <Button
                  onClick={handleJoinBattleRoom}
                  color="warning"
                  variant="outlined"
                >
                  Join
                </Button>
              )}
            </Box>
          );
        })}
    </Box>
  );
}
