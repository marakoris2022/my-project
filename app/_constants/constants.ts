import { getRandomInRange } from "../_utils/utils";

export const COOKIES_TOKEN_KEY_NAME = "authToken";

export const POKEMON_TRAINING_GROUND_RANGE = {
  MINUS: 10,
  PLUS: 40,
};

export const newUserDefaultParams = {
  level: 0,
  currentExp: 100,
  pokemonActive: false,
  regeneration: {
    isRegen: false,
    endRegen: 0,
  },
  training: {
    isTraining: false,
  },
  fight: {
    isFight: false,
  },
  battle: {
    isInBattle: false,
    isBattleCreated: false,
    isInBattleRequest: false,
  },
  caughtPokes: [
    "sunkern",
    "blipbug",
    "snom",
    "azurill",
    "caterpie",
    "weedle",
    "kricketot",
  ],
};

export const trainingGroundDefaultSettings = {
  background: `url(/training-ground-${getRandomInRange(1, 4)}.webp)`,
  backgroundFight: `url(/training-ground-fight-${getRandomInRange(1, 4)}.webp)`,
  lastButton: "down",
  windowWidth: 800,
  windowHeight: 500,
  heroTop: 10,
  heroLeft: 10,
  step: 10,
  opponent: {
    a: {
      top: getRandomInRange(50, 400),
      left: getRandomInRange(50, 700),
    },
    b: {
      top: getRandomInRange(50, 400),
      left: getRandomInRange(50, 700),
    },
    c: {
      top: getRandomInRange(50, 400),
      left: getRandomInRange(50, 700),
    },
    d: {
      top: getRandomInRange(50, 400),
      left: getRandomInRange(50, 700),
    },
    e: {
      top: getRandomInRange(50, 400),
      left: getRandomInRange(50, 700),
    },
  },
};
