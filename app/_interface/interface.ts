import { PokemonProfileProps } from "../_pokemonApi/pokemonDataApi";

export type SignUpDataProps = {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
};

export type SignInDataProps = {
  email: string;
  password: string;
};

export type FightDataProps = {
  dateTime: number;
  expGet: number;
  fightEnd: true;
  opponentAttackDmg: number;
  opponentAttackPlace: string;
  opponentBlockPlace: string;
  opponentName: string;
  pokemonGet: boolean;
  userAttackDmg: number;
  userAttackPlace: string;
  userBlockPlace: string;
  userName: string;
  newCurrentHPUser: number;
  newCurrentHPOpponent: number;
};

export type FightResponseProps = {
  fightData: FightDataProps;
  message: string;
  userData: PokemonProfileProps;
};

export type BattleRoomsUserProps = {
  level: number;
  pokemonName: string;
  currentHP: number;
  stats: {
    attack: number;
    defense: number;
    hp: number;
    "special-attack": number;
    "special-defense": number;
    speed: number;
  };
};

type BattleMove = {
  prevAuthHitDmg: number;
  prevAuthHitPart: string;
  prevOppHitDmg: number;
  prevOppHitPart: string;
  authorMove: null | {
    attack: string;
    block: string;
  };
  opponentMove: null | {
    attack: string;
    block: string;
  };
  time: number;
  endTime: number;
};

export type BattleRoomsProps = {
  authorData: BattleRoomsUserProps;
  authorName: string;
  opponentData: BattleRoomsUserProps;
  opponentName: string;
  time: number;
  timeFightStarts: number;
  battleMoves: BattleMove[];
};
