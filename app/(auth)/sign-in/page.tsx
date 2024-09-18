"use client";

import { SignInDataProps } from "@/app/_interface/interface";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/_firebase/firebaseConfig";
import Link from "next/link";
import { useState } from "react";
import { FirebaseAuthError } from "firebase-admin/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_customHooks/useAuth";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const { user, loading } = useAuth();

  const router = useRouter();

  if (loading) {
    return <Typography>Loading...</Typography>; // Показываем индикатор загрузки
  }

  if (!loading && user) {
    router.push("/");
  }

  const onSubmit = async (data: SignInDataProps | FieldValues) => {
    setFirebaseError(null); // Сброс ошибки перед новой попыткой
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/profile");
    } catch (error) {
      // Обработка ошибок Firebase
      switch ((error as FirebaseAuthError).code) {
        case "auth/user-not-found":
          setFirebaseError("User not found. Please check your email.");
          break;
        case "auth/wrong-password":
          setFirebaseError("Incorrect password. Please try again.");
          break;
        default:
          setFirebaseError("Something went wrong. Please try again.");
      }
    }
  };

  function handleReset() {
    reset();
    setFirebaseError(null); // Сброс ошибки при сбросе формы
  }

  return (
    <Box component={"main"} sx={{ pt: "30px", textAlign: "center" }}>
      <Typography component={"h1"} sx={{ pb: "20px" }}>
        Sign In
      </Typography>

      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: "15px" }}>
          <TextField
            label="E-mail"
            variant="standard"
            {...register("email", {
              required: "E-mail is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: "Invalid e-mail format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message?.toString() || ""}
          />
        </Box>
        <Box sx={{ mb: "15px" }}>
          <TextField
            label="Password"
            variant="standard"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message?.toString() || ""}
          />
        </Box>

        {/* Отображение ошибок Firebase */}
        {firebaseError && (
          <Typography color="error" sx={{ mb: "15px" }}>
            {firebaseError}
          </Typography>
        )}

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
