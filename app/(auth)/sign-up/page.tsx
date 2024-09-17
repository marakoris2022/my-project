"use client";

import { SignUpDataProps } from "@/app/_interface/interface";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/app/_firebase/firebaseConfig";
import Link from "next/link";
import { useState } from "react";
import { FirebaseAuthError } from "firebase-admin/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignUpDataProps | FieldValues) => {
    setFirebaseError(null); // Сброс ошибок перед новой попыткой
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      // Создание пользователя
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Обновление профиля пользователя с именем
      await updateProfile(user, {
        displayName: data.name,
      });

      // Перенаправление после успешной регистрации
      router.push("/");
    } catch (error) {
      // Обработка ошибок Firebase
      setFirebaseError(
        (error as FirebaseAuthError).code === "auth/email-already-in-use"
          ? "This email is already registered."
          : (error as FirebaseAuthError).message ||
              "Something went wrong. Please try again."
      );
    }
  };

  function handleReset() {
    reset();
    setFirebaseError(null); // Сброс ошибок при сбросе формы
  }

  return (
    <Box component={"main"} sx={{ pt: "30px", textAlign: "center" }}>
      <Typography component={"h1"} sx={{ pb: "20px" }}>
        Registration
      </Typography>

      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: "15px" }}>
          <TextField
            label="Name"
            variant="standard"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters long",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message?.toString() || ""}
          />
        </Box>
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
        <Box sx={{ mb: "20px" }}>
          <TextField
            label="Confirm password"
            variant="standard"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message?.toString() || ""}
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
