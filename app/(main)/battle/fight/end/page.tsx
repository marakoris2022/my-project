"use client";

import { Box, Button, Typography } from "@mui/material";
import StaticBackdrop from "@/app/_components/StaticBackdrop";
import { usePokemonRedirect } from "@/app/_customHooks/usePokemonRedirect";
import { useRouter } from "next/navigation";
import { getRandomInRange } from "@/app/_utils/utils";
import { postRequestToServer } from "@/app/_firebase/clientFirestireApi";

export default function ProfilePage() {
  const { loading, fetchedData } = usePokemonRedirect();
  const router = useRouter();

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

  async function handleEndBattle() {
    if (fetchedData) {
      try {
        await postRequestToServer(fetchedData.userId, {
          type: "end-battle-fight",
        });
        router.push("/profile");
      } catch (error) {}
    }
  }

  return (
    <Box>
      <Typography sx={{ textAlign: "center", padding: "20px" }} variant="h3">
        Battle is over. {fetchedData.currentHP > 0 ? " Victory!" : "Lose..."}
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
            Your experience for this battle is :{" "}
            {fetchedData.currentHP > 0
              ? Math.round(fetchedData.base_experience * 0.3)
              : 0}
            .
          </Typography>

          <Button
            variant="outlined"
            color="warning"
            sx={{ m: "20px", color: "black" }}
            onClick={handleEndBattle}
          >
            Exit Battle
          </Button>
        </Box>
        <Box
          sx={{
            backgroundImage:
              fetchedData.currentHP > 0
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
    </Box>
  );
}
