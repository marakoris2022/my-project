"use client";

import { SignUpDataProps } from "@/app/_interface/interface";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { validateSignUpData } from "./validateSignUpData";
import { useState } from "react";
import { createUser } from "@/app/_firebase/auth_signup_password";

export default function SignUp() {
  const [error, setError] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: SignUpDataProps | FieldValues) => {
    setError([]);
    const validate = validateSignUpData(data as SignUpDataProps);
    if (validate.length > 0) {
      setError(validate);
      return;
    }
    try {
      const respond = await createUser(data.email, data.password, data.name);
      console.log(`Registration Ok! ${respond.displayName}`);
    } catch (error) {
      setError([(error as Error).message]);
    }
  };

  function handleReset() {
    reset();
    setError([]);
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
          {Boolean(error.length > 0) &&
            error.map((errorItem, i) => {
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
