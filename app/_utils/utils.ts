import { FightDataProps } from "../_interface/interface";

export function encodeBase64(str: string) {
  return Buffer.from(str).toString("base64");
}

export function decodeBase64(base64Str: string) {
  return Buffer.from(base64Str, "base64").toString("ascii");
}

export function getRandomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function generateFightLog(fightData: FightDataProps) {
  const {
    opponentAttackPlace,
    userAttackPlace,
    userAttackDmg,
    opponentAttackDmg,
    dateTime,
    userName,
    opponentName,
  } = fightData;

  // Преобразование времени
  const fightTime = new Date(dateTime);
  const hours = String(fightTime.getHours()).padStart(2, "0");
  const minutes = String(fightTime.getMinutes()).padStart(2, "0");
  const seconds = String(fightTime.getSeconds()).padStart(2, "0");
  const formattedTime = `[${hours}:${minutes}:${seconds}]`;

  const userAttackResult =
    userAttackDmg > 0
      ? `${userName.toUpperCase()} successfully hit ${opponentName.toUpperCase()}'s ${userAttackPlace} for ${userAttackDmg} damage.`
      : `${userName.toUpperCase()}'s attack to ${opponentName.toUpperCase()}'s ${userAttackPlace} was blocked.`;

  const opponentAttackResult =
    opponentAttackDmg > 0
      ? `${opponentName.toUpperCase()} hit ${userName.toUpperCase()}'s ${opponentAttackPlace} for ${opponentAttackDmg} damage.`
      : `${opponentName.toUpperCase()}'s attack to ${userName.toUpperCase()}'s ${opponentAttackPlace} was blocked.`;

  return `${formattedTime} ${userAttackResult} ${opponentAttackResult}`;
}
