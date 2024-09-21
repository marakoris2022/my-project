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
  PokemonProps,
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

    let userData = await getUserData(userId);
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

    if (data.type === "training-fight") {
      const request = data as {
        type: string;
        opponentName: string;
      };

      try {
        if (!userData.training.isTraining) throw new Error("You cant fight!");

        if (!userData.pokemonActive) throw new Error("You don't have Pokemon");

        const existPokeKeysList = Object.keys(
          userData.training.opponents
        ) as Array<"a" | "b" | "c" | "d" | "e">;

        const pokemonData = existPokeKeysList.reduce<null | PokemonProps>(
          (acc, curVal) => {
            if (
              userData!.training.opponents[curVal].name === request.opponentName
            )
              acc = userData!.training.opponents[curVal];
            return acc;
          },
          null
        );

        if (!pokemonData) throw new Error("You can't fight with that!");

        const docId = await upsertUserData(userId, {
          fight: {
            isFight: true,
            opponent: { ...pokemonData, currentHP: pokemonData.stats.hp },
            battleStatus: {
              timeStart: Date.now(),
              attack: null,
              block: null,
            },
          },
        });

        const response = NextResponse.json(
          { message: "Fight is started successfully.", docId },
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

    if (data.type === "training-fight-move") {
      const request = data as {
        type: string;
        attack: "head" | "body" | "hands" | "lags";
        block: "head" | "body" | "hands" | "lags";
      };

      const moveArr = ["head", "body", "hands", "lags"];
      const opponentName = userData!.fight.opponent.name;

      let expGet = 0;
      let pokemonGet = false;
      let fightEnd = false;

      try {
        if (!userData.training.isTraining) throw new Error("You cant fight!");

        if (!userData.fight.isFight) throw new Error("You are not Fighting.");

        const opponentAttack = moveArr[getRandomInRange(0, 3)];
        const opponentBlock = moveArr[getRandomInRange(0, 3)];

        const userAttackCalculated = Math.round(
          getRandomInRange(
            userData.stats.attack * 0.7,
            userData.stats.attack * 1.2
          ) / 2
        );
        const userDefCalculated = Math.round(
          getRandomInRange(
            userData.stats.defense * 0.7,
            userData.stats.defense * 1.2
          )
        );
        const opponentAttackCalculated = Math.round(
          getRandomInRange(
            userData.fight.opponent.stats.attack * 0.7,
            userData.fight.opponent.stats.attack * 1.2
          ) / 2
        );
        const opponentDefCalculated = Math.round(
          getRandomInRange(
            userData.fight.opponent.stats.defense * 0.7,
            userData.fight.opponent.stats.defense * 1.2
          )
        );

        let userAttackDmg =
          userAttackCalculated * (1 - Math.round(opponentDefCalculated / 200)) -
          Math.round(opponentDefCalculated / 4);
        if (userAttackDmg < 1) userAttackDmg = 1;

        let opponentAttackDmg =
          opponentAttackCalculated * (1 - Math.round(userDefCalculated / 200)) -
          Math.round(userDefCalculated / 4);
        if (opponentAttackDmg < 1) opponentAttackDmg = 1;

        let newCurrentHPUser = userData.currentHP;
        let newCurrentHPOpponent = userData.fight.opponent.currentHP;

        if (request.attack === opponentBlock) userAttackDmg = 0;
        newCurrentHPOpponent = newCurrentHPOpponent - userAttackDmg;

        if (request.block === opponentAttack) opponentAttackDmg = 0;
        newCurrentHPUser = newCurrentHPUser - opponentAttackDmg;

        if (newCurrentHPOpponent > 0 && newCurrentHPUser > 0) {
          await upsertUserData(userId, {
            ...userData,
            currentHP: newCurrentHPUser,

            fight: {
              ...userData.fight,
              opponent: {
                ...userData.fight.opponent,
                currentHP: newCurrentHPOpponent,
              },
              battleStatus: {
                ...userData.fight.battleStatus,
                attack: request.attack,
                block: request.block,
              },
            },
          });
        } else {
          if (newCurrentHPUser < 0) newCurrentHPUser = 0;
          if (newCurrentHPUser > 0) {
            expGet = Math.round(userData.fight.opponent.base_experience / 20);
            pokemonGet = getRandomInRange(1, 10) === 1;
          }
          fightEnd = true;

          const caughtPokes = pokemonGet
            ? [...userData.caughtPokes, userData.fight.opponent.name]
            : userData.caughtPokes;

          await upsertUserData(userId, {
            ...userData,
            currentExp: userData.currentExp + expGet,
            currentHP: newCurrentHPUser,
            caughtPokes,
            fight: {
              isFight: false,
            },
            training: {
              isTraining: false,
            },
          });
        }

        userData = await getUserData(userId);

        return NextResponse.json(
          {
            message: "Fight request is Ok.",
            userData,
            fightData: {
              fightEnd,
              dateTime: Date.now(),
              userAttackDmg: userAttackDmg,
              userAttackPlace: request.attack,
              userBlockPlace: request.block,
              opponentAttackDmg: opponentAttackDmg,
              opponentAttackPlace: opponentAttack,
              opponentBlockPlace: opponentBlock,
              userName: userData!.playerName,
              opponentName,
              newCurrentHPUser,
              newCurrentHPOpponent,
              expGet,
              pokemonGet,
            },
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (data.type === "training-leave-fight") {
      try {
        if (!userData.fight.isFight) throw new Error("You are not Fighting.");

        const docId = await upsertUserData(userId, {
          fight: {
            isFight: false,
          },
          training: {
            isTraining: false,
          },
        });

        const response = NextResponse.json(
          { message: "You leave fight successfully.", docId },
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
