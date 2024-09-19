import { getRandomInRange } from "../_utils/utils";

export const COOKIES_TOKEN_KEY_NAME = "authToken";

export const trainingGroundDefaultSettings = {
  background: `url(/training-ground-${getRandomInRange(1, 4)}.webp)`,
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
