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
