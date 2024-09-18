import pokemonListFromJSON from "../../pokemonData.json";

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

const pokemonList = pokemonListFromJSON as PokemonProps[];

export function getPokemonByName(name: string) {
  return pokemonList.find((item) => item.name === name);
}

export function getPokemonArrayByPropsValue(
  propName: string,
  minValue: number = 0,
  maxValue: number = Infinity
) {
  return pokemonList.filter((item) => {
    const itemKeys = Object.keys(item);
    for (let i = 0; i < itemKeys.length; i++) {
      if (itemKeys[i] === propName) {
        if (item[propName] >= minValue && item[propName] <= maxValue) {
          return true;
        }
      }
    }
    return false;
  });
}
