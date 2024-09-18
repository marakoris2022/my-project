"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useAuth } from "@/app/_customHooks/useAuth";
import { FormEvent, useState } from "react";
import { upsertUserData } from "@/app/_firebase/firestoreAPI";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [testValue, setTestValue] = useState("");
  const [testKey, setTestKey] = useState("");

  if (loading) {
    return <Typography>Loading...</Typography>; // Показываем индикатор загрузки
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await upsertUserData(user!.uid, {
      [testKey + "b"]: testValue + "a",
      [testKey]: testValue,
    });
  }

  return (
    <Box sx={{ backgroundColor: "lightgray", height: "100vh" }}>
      <Container>
        <Box>
          <Typography>ProfilePage</Typography>
        </Box>
        <Box
          component={"form"}
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: "25px" }}
        >
          <Box>
            <TextField
              label="testKey"
              variant="standard"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
            />
          </Box>
          <Box>
            <TextField
              label="testValue"
              variant="standard"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
            />
          </Box>
          <Button
            sx={{ width: "fit-content" }}
            size="small"
            type="submit"
            variant="outlined"
          >
            Send
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
