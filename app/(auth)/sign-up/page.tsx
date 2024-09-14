"use client";

import { SignUpDataProps } from "@/app/_interface/interface";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { validateSignUpData } from "./validateSignUpData";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [errorValid, setErrorValid] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data: SignUpDataProps | FieldValues) => {
    setErrorValid([]);

    const validate = validateSignUpData(data as SignUpDataProps);
    if (validate.length > 0) {
      setErrorValid(validate);
      return;
    }

    try {
      const response = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
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
        Registration
      </Typography>

      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: "15px" }}>
          <TextField label="Name" variant="standard" {...register("name")} />
        </Box>
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
          <TextField
            label="Confirm password"
            variant="standard"
            type="password"
            {...register("confirmPassword")}
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
          {Boolean(errorValid.length > 0) &&
            errorValid.map((errorItem, i) => {
              return (
                <Typography
                  key={`${i}_error`}
                  component={"p"}
                  sx={{ color: "red" }}
                  fontSize={"14px"}
                >
                  {errorItem}
                </Typography>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}
