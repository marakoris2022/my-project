"use client";

import { SignInDataProps } from "@/app/_interface/interface";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/_firebase/firebaseConfig";
import Link from "next/link";

export default function SignIn() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: SignInDataProps | FieldValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch {}
  };

  function handleReset() {
    reset();
  }

  return (
    <Box component={"main"} sx={{ pt: "30px", textAlign: "center" }}>
      <Typography component={"h1"} sx={{ pb: "20px" }}>
        Sign In
      </Typography>

      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: "15px" }}>
          <TextField label="E-mail" variant="standard" {...register("email")} />
        </Box>
        <Box sx={{ mb: "15px" }}>
          <TextField
            label="Password"
            variant="standard"
            type="password"
            {...register("password")}
          />
        </Box>
        <Box sx={{ mb: "20px" }}>
          <Button sx={{ mr: "15px" }} variant="contained" type="submit">
            Submit
          </Button>
          <Button onClick={handleReset} variant="outlined">
            Reset
          </Button>
        </Box>
        <Link href={"/"}>
          <Button onClick={handleReset} variant="outlined">
            Back to Menu
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
