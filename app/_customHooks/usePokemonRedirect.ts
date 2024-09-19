import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { PokemonProfileProps } from "../_pokemonApi/pokemonDataApi";
import { fetchUserData } from "../_firebase/clientFirestireApi";
import { usePathname, useRouter } from "next/navigation";

export const usePokemonRedirect = () => {
  const { user } = useAuth();
  const [fetchedData, setFetchedData] = useState<
    PokemonProfileProps | null | undefined
  >(undefined);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname === "/") {
      setLoading(false);
    }
    if (user) {
      (async () => {
        const res = await fetchUserData(user.uid);
        setFetchedData(res ? res : null);
        setLoading(false);
      })();
    }
  }, [pathname, user]);

  useEffect(() => {
    if (
      fetchedData &&
      Boolean(fetchedData["chosenPokemon"]) === false &&
      pathname === "/profile"
    ) {
      router.push("/profile/create");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["chosenPokemon"]) === true &&
      pathname === "/profile/create"
    ) {
      router.push("/profile");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["training"].isTraining) === true &&
      pathname === "/training"
    ) {
      router.push("/training/ground");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["training"].isTraining) === false &&
      pathname === "/training/ground"
    ) {
      router.push("/training");
    }
  }, [fetchedData, pathname, router]);

  return { loading, user, fetchedData };
};
