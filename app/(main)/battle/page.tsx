"use client";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import {
  fetchUserData,
  postRequestToServer,
} from "@/app/_firebase/clientFirestireApi";
import { useEffect, useState } from "react";
import { getFormattedTime } from "@/app/_utils/utils";
import { getPokemonByName } from "@/app/_pokemonApi/pokemonDataApi";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
import AddIcon from "@mui/icons-material/Add";
import PermDeviceInformationIcon from "@mui/icons-material/PermDeviceInformation";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import { BattleRoomsProps } from "@/app/_interface/interface";
import { useRouter } from "next/navigation";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function BattlePage() {
  const { loading, fetchedData, setFetchedData } = usePokemonRedirect();
  const router = useRouter();
  const [battleRooms, setBattleRooms] = useState<null | BattleRoomsProps[]>(
    null
  );
  const [updateTime, setUpdateTimer] = useState(10);

  const handleGetBattleRooms = async () => {
    if (fetchedData) {
      try {
        const response = await postRequestToServer(fetchedData.userId, {
          type: "get-battle-rooms",
        });

        setBattleRooms(response.battleRooms);
        setFetchedData(await fetchUserData(fetchedData.userId));
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  };

  async function handleCloseRequest() {
    if (fetchedData) {
      try {
        await postRequestToServer(fetchedData.userId, {
          type: "close-battle-room",
        });

        // setBattleRooms(response.battleRooms); // обновляем battleRooms
        // setFetchedData(await fetchUserData(fetchedData.userId));
        await handleGetBattleRooms();
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  async function handleCreateBattle() {
    if (fetchedData) {
      try {
        await postRequestToServer(fetchedData.userId, {
          type: "create-battle",
        });

        // setBattleRooms(response.battleRooms); // обновляем battleRooms
        // setFetchedData(await fetchUserData(fetchedData.userId));
        await handleGetBattleRooms();
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  async function handleJoinBattleRoom(roomAuthorName: string) {
    if (fetchedData) {
      try {
        await postRequestToServer(fetchedData.userId, {
          type: "join-battle-room",
          roomOwnerName: roomAuthorName,
          opponentData: fetchedData,
        });

        // setBattleRooms(response.battleRooms); // обновляем battleRooms
        // setFetchedData(await fetchUserData(fetchedData.userId));
        await handleGetBattleRooms();
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  async function handleLeaveRequest() {
    if (fetchedData) {
      try {
        await postRequestToServer(fetchedData.userId, {
          type: "leave-battle-room",
          opponentData: fetchedData,
        });

        // setBattleRooms(response.battleRooms); // обновляем battleRooms
        // setFetchedData(await fetchUserData(fetchedData.userId));
        await handleGetBattleRooms();
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  async function handleStartBattleFight() {
    if (fetchedData) {
      try {
        await postRequestToServer(fetchedData.userId, {
          type: "start-battle-fight",
          authorUID: fetchedData.userId,
        });

        router.push("/battle/fight");
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (fetchedData) {
        const response = await postRequestToServer(fetchedData.userId, {
          type: "get-battle-rooms",
        });

        setBattleRooms(response.battleRooms);
      }
    })();
  }, [fetchedData]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    async function runTimer() {
      if (updateTime > 0) {
        timerId = setTimeout(() => {
          setUpdateTimer((time) => time - 1);
          runTimer();
        }, 1000);
      } else {
        await handleGetBattleRooms();
        setUpdateTimer(10);
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
        {!fetchedData.battle.isBattleCreated &&
          !fetchedData.battle.isInBattleRequest && (
            <Button
              color="success"
              endIcon={<AddIcon />}
              onClick={handleCreateBattle}
            >
              Create Battle
            </Button>
          )}
        {fetchedData.battle.isBattleCreated &&
          battleRooms?.find((room) => room.authorName == fetchedData.playerName)
            ?.opponentName && (
            <Tooltip title="In Progress...">
              <Button
                color="success"
                endIcon={<LocalFireDepartmentOutlinedIcon />}
                onClick={handleStartBattleFight}
              >
                Start Battle
              </Button>
            </Tooltip>
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
        {fetchedData.battle.isInBattleRequest &&
          battleRooms?.find(
            (room) => room.opponentName === fetchedData.playerName
          ) && (
            <Button
              endIcon={<MeetingRoomOutlinedIcon />}
              color="error"
              onClick={handleLeaveRequest}
            >
              Leave request
            </Button>
          )}
        <Button endIcon={<SyncIcon />} onClick={handleGetBattleRooms}>
          reload {updateTime}s.
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
                {Boolean(room.opponentName) && (
                  <ListItem sx={{ width: "fit-content", fontWeight: "bold" }}>
                    || {room.opponentName}
                    <Avatar
                      src={
                        getPokemonByName(room.opponentData.pokemonName)?.sprites
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
                    <HtmlTooltip
                      title={
                        <>
                          <List sx={{ display: "flex", flexDirection: "row" }}>
                            <ListItem sx={{ width: "110px" }}>
                              Hits: {room.opponentData.stats.hp}
                            </ListItem>
                            <ListItem sx={{ width: "110px" }}>
                              ATK: {room.opponentData.stats.attack}
                            </ListItem>
                            <ListItem sx={{ width: "110px" }}>
                              DEF: {room.opponentData.stats.defense}
                            </ListItem>
                          </List>
                          <List sx={{ display: "flex", flexDirection: "row" }}>
                            <ListItem sx={{ width: "110px" }}>
                              S-ATK: {room.opponentData.stats["special-attack"]}
                            </ListItem>
                            <ListItem sx={{ width: "110px" }}>
                              S-DEF:{" "}
                              {room.opponentData.stats["special-defense"]}
                            </ListItem>
                            <ListItem sx={{ width: "110px" }}>
                              SPD: {room.opponentData.stats.speed}
                            </ListItem>
                          </List>
                        </>
                      }
                    >
                      <IconButton color="warning">
                        <PermDeviceInformationIcon />
                      </IconButton>
                    </HtmlTooltip>
                  </ListItem>
                )}
              </List>
              {Boolean(room.authorName !== fetchedData.playerName) &&
                Boolean(!room.opponentName) && (
                  <Button
                    onClick={() => {
                      handleJoinBattleRoom(room.authorName);
                    }}
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
