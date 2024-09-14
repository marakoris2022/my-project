"use client";

import { SignInDataProps } from "@/app/_interface/interface";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { validateSignInData } from "./validateSignInData";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/_firebase/firebaseConfig";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { register, handleSubmit, reset } = useForm();
  const [errorValid, setErrorValid] = useState<string[]>([]);
  const router = useRouter();

  const onSubmit = async (data: SignInDataProps | FieldValues) => {
    setErrorValid([]);
    const isErrorArray = validateSignInData(data as SignInDataProps);
    if (isErrorArray.length > 0) {
      setErrorValid(isErrorArray);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const token = await userCredential.user.getIdToken(true);

      const response = await fetch("api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });

      // Проверка на успешный статус
      if (!response.ok) {
        const errorResponse = await response.json(); // Получаем сообщение об ошибке
        throw new Error(errorResponse.error || "Something went wrong"); // Выбрасываем ошибку с сообщением
      }

      router.push("/profile");
    } catch (error) {
      console.error("Error occurred:", error.message);
      setErrorValid([error.message]); // Устанавливаем сообщение об ошибке
    }
  };

  function handleReset() {
    reset();
    setErrorValid([]);
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
        <Box>
          {Boolean(errorValid.length) && (
            <Box>
              <Typography
                component={"p"}
                sx={{ color: "red" }}
                fontSize={"14px"}
              >
                {errorValid}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
