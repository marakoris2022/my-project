"use client";

import { Box, Button, Typography } from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { saveUserData } from "@/app/_firebase/clientFirestireApi";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const router = useRouter();

  if (loading || fetchedData === undefined) {
    return <StaticBackdrop />;
  }

  async function handleTraining() {
    await saveUserData(fetchedData!.userId, {
      training: {
        isTraining: true,
        trainingStarted: Date.now(),
        trainingEnd: Date.now() + 1000 * 60,
        opponents: {
          a: "pikachu",
          b: "pikachu",
          c: "pikachu",
          d: "pikachu",
          e: "pikachu",
        },
      },
    });
    router.push("/training/ground");
  }

  if (!fetchedData)
    return (
      <Box>
        <Typography>Something went wrong.</Typography>
        <Typography>{`Can't get user data.`}</Typography>
      </Box>
    );

  if (fetchedData && !fetchedData["training"].isTraining)
    return (
      <Box>
        <Typography>Start training?</Typography>
        <Button onClick={handleTraining}>Start</Button>
      </Box>
    );

  return <Box>Training Ground</Box>;
}
