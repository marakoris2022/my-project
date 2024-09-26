import pokemonListFromJSON from "../../pokemonData.json";

type BattleStatusProps = {
  timeStart: number;
  attack: null | string;
  block: null | string;
};

type TrainingProps = {
  isTraining: boolean;
  trainingStarted: number;
  trainingEnd: number;
  opponents: {
    a: PokemonProps;
    b: PokemonProps;
    c: PokemonProps;
    d: PokemonProps;
    e: PokemonProps;
  };
};

type FightOpponent = PokemonProps & {
  currentHP: number;
};

type FightProps = {
  isFight: boolean;
  opponent: FightOpponent;
  battleStatus: BattleStatusProps;
};

type SpritesProps = {
  back_default: string;
  front_default: string;
};

type StatsProps = {
  attack: number;
  defense: number;
  hp: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
};

export type PokemonProps = {
  base_experience: number;
  height: number;
  name: string;
  order: number;
  sprites: SpritesProps;
  stats: StatsProps;
  types: string;
  weight: number;
};

export type PokemonProfileProps = PokemonProps & {
  chosenPokemon: string;
  currentExp: number;
  currentHP: number;
  id: string;
  level: number;
  userId: string;
  playerName: string;
  training: TrainingProps;
  fight: FightProps;
  caughtPokes: string[];
  pokemonActive: boolean;
  regeneration: {
    isRegen: boolean;
    endRegen: number;
  };
  battle: {
    isInBattle: boolean;
    isBattleCreated: boolean;
    isInBattleRequest: boolean;
    isBattleOver: boolean;
  };
};

const pokemonList = pokemonListFromJSON as PokemonProps[];

export function getPokemonByName(name: string) {
  return pokemonList.find((item) => item.name === name);
}

export function getPokemonListByExp(by: "inc" | "dec") {
  if (by === "inc") {
    return pokemonList.sort((a, b) => a.base_experience - b.base_experience);
  }
  return pokemonList.sort((a, b) => b.base_experience - a.base_experience);
}

export function getPokemonListByExpRange(minExp: number, maxExp: number) {
  return pokemonList.filter(
    (pokemon) =>
      pokemon.base_experience >= minExp && pokemon.base_experience <= maxExp
  );
}

export function getPokemonListByNames(names: string[]) {
  const pokemonByNames = names.map((name) => getPokemonByName(name));
  return pokemonByNames.filter((item) => typeof item !== "undefined");
}
