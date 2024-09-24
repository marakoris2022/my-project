// app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  createBattleRoom,
  deleteBattleRoom,
  getBattleRooms,
  getUserData,
  getUserDataByName,
  updateBattleRoom,
  upsertUserData,
} from "@/app/_firebase/firestoreAPI";
import {
  newUserDefaultParams,
  POKEMON_TRAINING_GROUND_RANGE,
} from "@/app/_constants/constants";
import {
  getPokemonByName,
  getPokemonListByExpRange,
  PokemonProfileProps,
  PokemonProps,
} from "@/app/_pokemonApi/pokemonDataApi";
import { getRandomInRange } from "@/app/_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();

    if (data.type === "check-user-name") {
      const requestBody = data as {
        type: string;
        userName: string;
      };

      const respond = await getUserDataByName(requestBody.userName);

      const response = respond
        ? NextResponse.json({ message: "User name busy." }, { status: 200 })
        : NextResponse.json({ message: "User name free." }, { status: 200 });

      return response;
    }

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
        fight: {
          isFight: false,
        },
        training: {
          isTraining: false,
        },
        regeneration: {
          isRegen: false,
          endRegen: 0,
        },
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

    if (data.type === "increase-stat") {
      const request = data as {
        type: string;
        statKey:
          | "attack"
          | "defense"
          | "hp"
          | "special-attack"
          | "special-defense"
          | "speed";
      };

      if (userData.currentExp < 10) throw new Error("You don't have exp!");

      // Увеличиваем нужную статистику на 1
      const updatedStats = {
        ...userData.stats,
        [request.statKey]: userData.stats[request.statKey] + 1,
      };

      await upsertUserData(userId, {
        stats: updatedStats,
        currentExp: userData.currentExp - 10, // Уменьшаем опыт на 10
      });

      const updateUseData = await getUserData(userId);

      const response = NextResponse.json(
        { message: "Stat increased successfully.", updateUseData },
        { status: 200 }
      );

      return response;
    }

    if (data.type === "start-regeneration") {
      try {
        if (userData.training.isTraining) {
          throw new Error("You can't regenerate while training.");
        }

        if (userData.fight.isFight) {
          throw new Error("You can't regenerate while fighting.");
        }

        if (userData.currentHP === userData.stats.hp) {
          throw new Error("You are already at full health.");
        }

        if (
          !userData.regeneration.isRegen &&
          userData.currentHP < userData.stats.hp
        ) {
          const healingTime = (userData.stats.hp - userData.currentHP) * 2000;
          const endTime = Date.now() + healingTime;

          await upsertUserData(userId, {
            regeneration: {
              isRegen: true,
              endRegen: endTime,
            },
          });

          return NextResponse.json(
            { message: "Regeneration started successfully.", endTime },
            { status: 200 }
          );
        }

        if (
          userData.regeneration.isRegen &&
          userData.currentHP < userData.stats.hp &&
          userData.regeneration.endRegen - Date.now() <= 0
        ) {
          await upsertUserData(userId, {
            currentHP: userData.stats.hp,
            regeneration: {
              isRegen: false,
              endRegen: 0,
            },
          });

          return NextResponse.json(
            { message: "Regeneration finished successfully." },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { message: "Regeneration started successfully." },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (data.type === "start-training") {
      try {
        if (userData.training.isTraining)
          return NextResponse.json(
            { error: "You are already training" },
            { status: 400 }
          );

        if (!userData.pokemonActive)
          return NextResponse.json(
            { error: "You don't have a Pokemon" },
            { status: 400 }
          );

        if (userData.currentHP < userData.stats.hp)
          return NextResponse.json(
            {
              error: "You must restore your health to enter a training ground.",
            },
            { status: 400 }
          );

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

    if (data.type === "create-battle") {
      try {
        if (userData.fight.isFight) throw new Error("You are Fighting.");

        if (userData.battle.isBattleCreated)
          throw new Error("Battle already created.");

        if (userData.battle.isInBattleRequest)
          throw new Error("You are already in battle request.");

        if (userData.battle.isInBattle)
          throw new Error("You are already in battle.");

        await createBattleRoom(userData.userId, userData);

        await upsertUserData(userId, {
          battle: {
            ...userData.battle,
            isBattleCreated: true,
          },
        });

        const battleRooms = await getBattleRooms();

        const response = NextResponse.json(
          { message: "Room is created.", battleRooms },
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

    if (data.type === "get-battle-rooms") {
      try {
        const respond = await getBattleRooms();

        const battleRooms = respond.map((item) => {
          const opponentData = item.opponentData
            ? {
                level: item.opponentData.level,
                pokemonName: item.opponentData.name,
                stats: item.opponentData.stats,
                currentHP: item.opponentData.currentHP,
              }
            : null;

          const obj = {
            authorData: {
              level: item.authorData.level,
              pokemonName: item.authorData.name,
              stats: item.authorData.stats,
              currentHP: item.authorData.currentHP,
            },
            authorName: item.authorName,
            opponentData: opponentData,
            opponentName: item.opponentName,
            time: item.time,
            battleMoves: item.battleMoves,
          };
          return obj;
        });

        const response = NextResponse.json(
          { message: "Battle rooms.", battleRooms },
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

    if (data.type === "close-battle-room") {
      try {
        if (userData.fight.isFight)
          throw new Error("You are currently in a fight.");

        if (!userData.battle.isBattleCreated)
          throw new Error("You don't have an active battle room.");

        if (userData.battle.isInBattleRequest)
          throw new Error("You already have a pending battle request.");

        if (userData.battle.isInBattle)
          throw new Error("You are already participating in a battle.");

        const deletedRoomData = await deleteBattleRoom(
          userData.userId,
          userData
        );

        // Из deletedRoomData получить данные оппонента и закрыть его комнату.
        if (deletedRoomData && deletedRoomData.opponentData) {
          const opponent = deletedRoomData.opponentData;
          await upsertUserData(opponent.userId, {
            ...opponent,
            battle: {
              ...opponent.battle,
              isInBattleRequest: false,
            },
          });
        }

        await upsertUserData(userId, {
          ...userData,
          battle: {
            ...userData.battle,
            isBattleCreated: false,
          },
        });

        const battleRooms = await getBattleRooms();

        return NextResponse.json(
          { message: "Room is closed.", battleRooms },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (data.type === "join-battle-room") {
      try {
        const request = data as {
          type: string;
          roomOwnerName: string;
          opponentData: PokemonProfileProps;
        };

        if (userData.fight.isFight)
          throw new Error("You are currently in a fight.");

        if (userData.battle.isBattleCreated)
          throw new Error("You already have a room.");

        if (userData.battle.isInBattleRequest)
          throw new Error("You already have a pending battle request.");

        if (userData.battle.isInBattle)
          throw new Error("You are already participating in a battle.");

        const allBattleRooms = await getBattleRooms();
        const battleRoomData = allBattleRooms.find(
          (room) => room.authorName === request.roomOwnerName
        );

        if (!battleRoomData) throw new Error("Cant find battle room.");

        if (battleRoomData!.opponentName)
          throw new Error("Someone already in request.");

        await updateBattleRoom(request.roomOwnerName, {
          ...JSON.parse(JSON.stringify(battleRoomData)),
          opponentData: request.opponentData,
          opponentName: request.opponentData.playerName,
        });

        await upsertUserData(userId, {
          ...userData,
          battle: {
            ...userData.battle,
            isInBattleRequest: true,
          },
        });

        const battleRooms = await getBattleRooms();

        return NextResponse.json(
          { message: "Room is closed.", battleRooms },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (data.type === "leave-battle-room") {
      try {
        const request = data as {
          type: string;
          opponentData: PokemonProfileProps;
        };

        if (userData.fight.isFight)
          throw new Error("You are currently in a fight.");

        if (userData.battle.isBattleCreated)
          throw new Error("You already have a room.");

        if (!userData.battle.isInBattleRequest)
          throw new Error("You must to be in battle room.");

        if (userData.battle.isInBattle)
          throw new Error("You are already participating in a battle.");

        const allBattleRooms = await getBattleRooms();
        const battleRoomData = allBattleRooms.find(
          (room) => room.opponentName === request.opponentData.playerName
        );

        if (!battleRoomData) throw new Error("Cant find battle room.");

        if (!battleRoomData.opponentName)
          throw new Error("There is no opponent in the battle room.");

        await updateBattleRoom(battleRoomData.authorName, {
          ...JSON.parse(JSON.stringify(battleRoomData)),
          opponentData: null,
          opponentName: null,
        });

        await upsertUserData(userId, {
          ...userData,
          battle: {
            ...userData.battle,
            isInBattleRequest: false,
          },
        });

        const battleRooms = await getBattleRooms();

        return NextResponse.json(
          { message: "You levae the room.", battleRooms },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (data.type === "start-battle-fight") {
      try {
        if (userData.fight.isFight)
          throw new Error("You are currently in a fight.");

        if (
          !userData.battle.isInBattleRequest &&
          !userData.battle.isBattleCreated
        )
          throw new Error("You need create or join battle room.");

        if (userData.battle.isInBattle)
          throw new Error("You are already participating in a battle.");

        const allBattleRooms = await getBattleRooms();
        const battleRoomData = allBattleRooms.find(
          (room) => room.authorName === userData!.playerName
        );

        if (!battleRoomData) throw new Error("Cant find battle room.");

        if (!battleRoomData.opponentName)
          throw new Error("There is no opponent in the battle room.");

        await updateBattleRoom(battleRoomData.authorName, {
          ...JSON.parse(JSON.stringify(battleRoomData)),
          timeFightStarts: Date.now(),
          battleMoves: [
            {
              authorMove: null,
              opponentMove: null,
              time: Date.now(),
              endTime: Date.now() + 1000 + 30,
            },
          ],
        });

        await upsertUserData(battleRoomData.authorData.userId, {
          ...userData,
          battle: {
            ...userData.battle,
            isInBattle: true,
          },
        });

        const opponent = await getUserDataByName(
          battleRoomData.opponentData.playerName
        );

        if (!opponent) throw new Error("Cant find opponent");

        await upsertUserData(opponent.userId, {
          ...opponent,
          battle: {
            ...opponent.battle,
            isInBattle: true,
          },
        });

        return NextResponse.json(
          { message: "Fight is started." },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (data.type === "battle-fight-move") {
      const request = data as {
        type: string;
        attack: "head" | "body" | "hands" | "lags";
        block: "head" | "body" | "hands" | "lags";
      };

      // const moveArr = ["head", "body", "hands", "lags"];

      try {
        if (!userData.battle.isInBattle) throw new Error("You cant fight!");

        let battleRooms = await getBattleRooms();

        let room = battleRooms.find(
          (room) =>
            room.authorName === userData?.playerName ||
            room.opponentName === userData?.playerName
        );

        if (!room) throw new Error("Cant find room!");

        const isAuthor = room.authorName === userData.playerName;

        if (
          isAuthor &&
          room.battleMoves[room.battleMoves.length - 1].authorMove?.attack
        )
          throw new Error("Move already done!");

        if (
          !isAuthor &&
          room.battleMoves[room.battleMoves.length - 1].opponentMove?.attack
        )
          throw new Error("Move already done!");

        const battleMoves = [...room.battleMoves];

        if (isAuthor) {
          battleMoves[battleMoves.length - 1].authorMove = {
            attack: request.attack,
            block: request.block,
          };
          await updateBattleRoom(room.authorName, {
            ...room,
            battleMoves: battleMoves,
          });
        }

        if (!isAuthor) {
          battleMoves[battleMoves.length - 1].opponentMove = {
            attack: request.attack,
            block: request.block,
          };
          await updateBattleRoom(room.authorName, {
            ...room,
            battleMoves: battleMoves,
          });
        }

        battleRooms = await getBattleRooms();

        room = battleRooms.find(
          (room) =>
            room.authorName === userData?.playerName ||
            room.opponentName === userData?.playerName
        );

        if (
          !room!.battleMoves[room!.battleMoves.length - 1].authorMove ||
          !room!.battleMoves[room!.battleMoves.length - 1].opponentMove
        ) {
          return NextResponse.json(
            { message: "Move is Done." },
            { status: 200 }
          );
        }

        const userAttackCalculated = Math.round(
          getRandomInRange(
            room!.authorData.stats.attack * 0.7,
            room!.authorData.stats.attack * 1.2
          ) / 2
        );
        const userDefCalculated = Math.round(
          getRandomInRange(
            room!.authorData.stats.defense * 0.7,
            room!.authorData.stats.defense * 1.2
          )
        );
        const opponentAttackCalculated = Math.round(
          getRandomInRange(
            room!.opponentData.stats.attack * 0.7,
            room!.opponentData.stats.attack * 1.2
          ) / 2
        );
        const opponentDefCalculated = Math.round(
          getRandomInRange(
            room!.opponentData.stats.defense * 0.7,
            room!.opponentData.stats.defense * 1.2
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

        let newCurrentHPUser = room!.authorData.currentHP;
        let newCurrentHPOpponent = room!.opponentData.currentHP;

        const authorAttack =
          room!.battleMoves[room!.battleMoves.length - 1].authorMove.attack;
        const authorBLock =
          room!.battleMoves[room!.battleMoves.length - 1].authorMove.block;
        const opponentAttack =
          room!.battleMoves[room!.battleMoves.length - 1].opponentMove.attack;
        const opponentBlock =
          room!.battleMoves[room!.battleMoves.length - 1].opponentMove.block;

        if (authorAttack === opponentBlock) userAttackDmg = 0;
        newCurrentHPOpponent = newCurrentHPOpponent - userAttackDmg;

        if (authorBLock === opponentAttack) opponentAttackDmg = 0;
        newCurrentHPUser = newCurrentHPUser - opponentAttackDmg;

        const authorData = await getUserDataByName(room!.authorName);
        const opponentData = await getUserDataByName(room!.opponentName);

        if (newCurrentHPOpponent > 0 && newCurrentHPUser > 0) {
          await upsertUserData(authorData!.userId, {
            ...authorData,
            currentHP: newCurrentHPUser,
          });

          await upsertUserData(opponentData!.userId, {
            ...opponentData,
            currentHP: newCurrentHPOpponent,
          });

          const battleMoves = [...room!.battleMoves];

          battleMoves.push({
            prevAuthHitDmg: userAttackDmg,
            prevAuthHitPart: authorAttack,
            prevOppHitDmg: opponentAttackDmg,
            prevOppHitPart: opponentAttack,
            authorMove: null,
            opponentMove: null,
            time: Date.now(),
            endTime: Date.now() + 1000 + 30,
          });

          await updateBattleRoom(room!.authorName, {
            ...room,
            authorData: {
              ...authorData,
              currentHP: newCurrentHPUser,
            },
            opponentData: {
              ...opponentData,
              currentHP: newCurrentHPOpponent,
            },
            battleMoves: battleMoves,
          });

          return NextResponse.json(
            { message: "Move is Done." },
            { status: 200 }
          );
        }

        return NextResponse.json({ message: "+" }, { status: 200 });
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
