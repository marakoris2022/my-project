// app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserData, upsertUserData } from "@/app/_firebase/firestoreAPI";
import {
  newUserDefaultParams,
  POKEMON_TRAINING_GROUND_RANGE,
} from "@/app/_constants/constants";
import {
  getPokemonByName,
  getPokemonListByExpRange,
} from "@/app/_pokemonApi/pokemonDataApi";
import { getRandomInRange } from "@/app/_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();

    if (data.type === "registration") {
      const requestBody = data as {
        type: string;
        userName: string;
      };

      const docId = await upsertUserData(userId, {
        ...newUserDefaultParams,
        playerName: requestBody.userName,
      });

      const response = NextResponse.json(
        { message: "User registered successfully.", docId },
        { status: 200 }
      );

      return response;
    }

    const userData = await getUserData(userId);
    if (!userData) throw new Error("Cant find user");

    if (data.type === "remove-pokemon") {
      if (!userData.pokemonActive) throw new Error("You don't have Pokemon.");

      const docId = await upsertUserData(userId, {
        pokemonActive: false,
      });

      const response = NextResponse.json(
        { message: "Pokemon successfully removed.", docId },
        { status: 200 }
      );

      return response;
    }

    if (data.type === "choose-pokemon") {
      const requestBody = data as {
        type: string;
        name: string;
      };

      if (userData.pokemonActive) throw new Error("You already have Pokemon");

      const checkPokeInUserData = userData.caughtPokes.find(
        (p) => p === requestBody.name
      );

      if (!checkPokeInUserData) throw new Error("You don't have this Pokemon");

      const pokemonData = getPokemonByName(checkPokeInUserData);

      const docId = await upsertUserData(userId, {
        pokemonActive: true,
        chosenPokemon: pokemonData!.name,
        currentHP: pokemonData!.stats.hp,
        maxHP: pokemonData!.stats.hp,
        ...pokemonData,
      });

      const response = NextResponse.json(
        { message: "User registered successfully.", docId },
        { status: 200 }
      );

      return response;
    }

    if (data.type === "leave-training") {
      if (!userData.training.isTraining)
        throw new Error("You are not training");

      const docId = await upsertUserData(userId, {
        training: {
          isTraining: false,
        },
      });

      const response = NextResponse.json(
        { message: "User registered successfully.", docId },
        { status: 200 }
      );

      return response;
    }

    if (data.type === "start-training") {
      try {
        if (userData.training.isTraining)
          throw new Error("You are already training");

        if (!userData.pokemonActive) throw new Error("You don't have Pokemon");

        const pokemonDataList = getPokemonListByExpRange(
          userData!.currentExp - POKEMON_TRAINING_GROUND_RANGE.MINUS,
          userData!.currentExp + POKEMON_TRAINING_GROUND_RANGE.PLUS
        );

        const docId = await upsertUserData(userId, {
          training: {
            isTraining: true,
            trainingStarted: Date.now(),
            trainingEnd: Date.now() + 1000 * 60 * 5,
            opponents: {
              a: pokemonDataList[
                getRandomInRange(0, pokemonDataList.length - 1)
              ],
              b: pokemonDataList[
                getRandomInRange(0, pokemonDataList.length - 1)
              ],
              c: pokemonDataList[
                getRandomInRange(0, pokemonDataList.length - 1)
              ],
              d: pokemonDataList[
                getRandomInRange(0, pokemonDataList.length - 1)
              ],
              e: pokemonDataList[
                getRandomInRange(0, pokemonDataList.length - 1)
              ],
            },
          },
        });

        const response = NextResponse.json(
          { message: "Training successfully started.", docId },
          { status: 200 }
        );

        return response;
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Server cant handle this request" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding user data" },
      { status: 500 }
    );
  }
}

// Метод GET для получения данных пользователя
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userData = await getUserData(userId);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(userData, { status: 200 });
    response.headers.set("Cache-Control", "no-store"); // отключает кеширование

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}
